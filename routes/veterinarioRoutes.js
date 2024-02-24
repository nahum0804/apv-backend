import express from 'express';
import { registrar, perfil, confirmar, autenticar, olvidarPassword, validarToken, resetPassword, actualizarPerfil, actualizarPassword } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();


//Public routes
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/recuperar', olvidarPassword);
//    --------------- integration of the email sender is missing ----------------
router.route('/recuperar/:token').get(validarToken).post(resetPassword);

//Private routes
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);


export default router;