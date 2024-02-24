import Paciente from "../models/Paciente.js";


const agregarPaciente = async (req, res) => {
    
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;

    try {
        const pacienteCreado = await paciente.save();
        res.json(pacienteCreado);  //Show JSON in Postman
        console.log(pacienteCreado);
    } catch (error) {
        res.status(400).send('Hubo un error');
    }
};

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);  //.where() is used to filter the results of the query
    res.json(pacientes);
};



const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json('Paciente no encontrado');
    }

    if(paciente.veterinario._id.toString() != req.veterinario._id.toString()) {
        return res.status(401).json({ msg: 'No autorizado' });
    }

    // Get the patient
    res.json(paciente);
};



const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({ msg: 'Paciente no encontrado'});
    }

    if(paciente.veterinario._id.toString() != req.veterinario._id.toString()) {
        return res.status(401).json({ msg: 'No autorizado' });
    }

    // Update the patient
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;


    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
};



const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json( { msg: "Paciente no encontrado" } );
    }

    if(paciente.veterinario._id.toString() != req.veterinario._id.toString()) {
        return res.status(401).json({ msg: 'No autorizado' });
    }

    try {
        await Paciente.deleteOne();
        res.json({ msg: 'Paciente eliminado' });
    } catch (error) {
       console.log(error); 
    }
};



export { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente };