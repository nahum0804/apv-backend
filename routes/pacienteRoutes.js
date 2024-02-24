import express from 'express';
import { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from '../controllers/pacienteControllers.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// checkAuth is a middleware function that checks if the user is logged in before allowing access to the route
router.route('/').post(checkAuth, agregarPaciente).get(checkAuth, obtenerPacientes) 

router.route('/:id').get(checkAuth, obtenerPaciente).put(checkAuth, actualizarPaciente).delete(checkAuth, eliminarPaciente);


export default router;