import mongoose from "mongoose";  // Para el esquema de la base de datos
import bcrypt from "bcrypt";  // Para encriptar la contraseña
import generarId from "../helpers/generarid.js";  // Para generar el token de confirmación

const VeterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // No puede haber dos veterinarios con el mismo email
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
        trim: true
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmed: {
        type: Boolean,
        default: false
    }
});

// Hash password before saving to database
VeterinarioSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }

    // Salt es un string aleatorio que se añade al password para hacerlo más seguro
    const salt = await bcrypt.genSalt(10);
    // Hash es el password encriptado
    this.password = await bcrypt.hash(this.password, salt);
});

VeterinarioSchema.methods.matchPassword = async function(passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
};

const Veterinario = mongoose.model('veterinario', VeterinarioSchema);
export default Veterinario;  //Para usar el modelo de mongo en otros archivos