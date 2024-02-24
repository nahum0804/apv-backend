import mongoose from "mongoose";

const PacienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    propietario: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas: {
        type: String,
        required: true,
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'veterinario',
        required: true
    }
}, {
    timestamps: true
});

const Paciente = mongoose.model('paciente', PacienteSchema);

export default Paciente;