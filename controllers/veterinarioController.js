import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarid.js';    
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';


// Registrar veterinario ---------------------------------------
const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    //Revisar si el veterinario ya está registrado
    const usuarioExistente = await Veterinario.findOne({email}); // {email: email} <= Object Literal
    
    if(usuarioExistente) {
        const error = new Error('User already exists');
        return res.status(400).json({msg: error.message});
    }

    try {
        //Guardar nuevo veterinario en la BD
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar email de confirmación
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json({veterinarioGuardado});
        
    } catch (error) {
        console.log(error);
    }

}



// Obtener perfil de veterinario ---------------------------------------
const perfil = (req, res) => {
    const { veterinario } = req;

    res.json(veterinario);
}



// Confirmar cuenta de veterinario ---------------------------------------
const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuariaConfirmar = await Veterinario.findOne({token}); //Object Literal (Again!)

    if (!usuariaConfirmar) {
        const error = new Error('Invalid token');
        return res.status(404).json({msg: error.message});
    }

    try {
        usuariaConfirmar.token = null;
        usuariaConfirmar.confirmed = true;
        await usuariaConfirmar.save();

        res.json({msg: 'User confirmed successfully'});
    } catch (error) {
        console.log(error);
    }
    
};



// Autenticar veterinario ---------------------------------------
const autenticar = async (req, res) => {
    const { email, password } = req.body;

    ///Comprobar si el usuario existe
    const usuarioExistente = await Veterinario.findOne({email});

    if (!usuarioExistente) {
        const error = new Error('User does not exist'); 
        return res.status(404).json({msg: error.message});
    }

    //Comprobar si esta registrado
    if (!usuarioExistente.confirmed) {
        const error = new Error('User is not confirmed');
        return res.status(401).json({msg: error.message});
    }

    //Comprobar el password
    if(await usuarioExistente.matchPassword(password)) {
        //Autenticar usuario
        res.json({
            _id: usuarioExistente.id,
            nombre: usuarioExistente.nombre,
            email: usuarioExistente.email,
            token: generarJWT(usuarioExistente.id)
        });
    } else {
        const error = new Error('Invalid password');
        return res.status(401).json({msg: error.message});
    }
};


// Olvidar password de veterinario ---------------------------------------
const olvidarPassword = async (req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario) {
        const error = new Error('User does not exist');
        return res.status(404).json({msg: error.message});
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();  //Save token to database

        //Send email to reset password to user
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });

        res.json({msg: 'Sending email to reset password'});
    } catch (error) {
        console.log(error);
    }
}

// Validar token de veterinario ---------------------------------------
const validarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido) {
        res.json({msg: 'Token valid, user exists'});
    } else {
        const error = new Error('Invalid token, user does not exist');
        return res.status(401).json({msg: error.message});
    }
}

// Resetear password de veterinario ---------------------------------------
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({token});

    if(!veterinario) {
        const error = new Error('Invalid token');
        return res.status(401).json({msg: error.message});
    }

    try {
        veterinario.password = password;
        veterinario.token = null;  //Delete temporal token from database
        await veterinario.save();

        res.json({msg: 'Password updated successfully'});

    } catch (error) {
        console.log(error);
    }
};

// Actualizar perfil de veterinario ---------------------------------------
const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById( req.params.id );

    if( !veterinario ){
        const error = new Error('Hubo un error');
        return res.status( 400 ).json( { msg: error.message });
    }

    const { email } = req.body;

    if( veterinario.email !== req.body.email ){
        
        const existeEmail = await Veterinario.findOne( { email });

        if( existeEmail ){

            const error = new Error('Ese email ya esta en uso');
            return res.status( 400 ).json( { msg: error.message });

        }
    }

    try {
        
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();

        res.json( veterinarioActualizado );

    } catch (error) {
        console.log(  error );
    }
}
//Actualizar perfil de veterinario ---------------------------------------


// Actualizar password de veterinario ---------------------------------------
const actualizarPassword = async (req, res) => {
    //Leer datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    //Verificar si el usuario existe
    const veterinario = await Veterinario.findById( id );

    if( !veterinario ){
        const error = new Error('Hubo un error');
        return res.status( 400 ).json( { msg: error.message });
    }

    //Validar el password actual del usuario
    if(await veterinario.matchPassword(pwd_actual)){
        //Actualizar password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json( { msg: 'Password Actualizado Correctamente' } );
    } else {
        const error = new Error('Password Actual es incorrecto');
        return res.status( 400 ).json( { msg: error.message });
    }
}
// Actualizar password de veterinario ---------------------------------------

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidarPassword,
    validarToken,
    resetPassword,
    actualizarPerfil,
    actualizarPassword
}