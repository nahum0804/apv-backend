import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            req.veterinario = await Veterinario.findById(decode.id).select('-password'); //Get all elements except password
            return next();

        } catch (error) {
            const e = new Error('Token no válido');
            res.status(403).json({message: e.message}); 
        }
    }

    if(!token) {
        const e = new Error('No autorizado, no hay token');
        res.status(403).json({message: e.message});
    }

    next();
}

export default checkAuth;