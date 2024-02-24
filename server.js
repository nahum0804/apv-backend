import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import VeterinarioRoutes from "./routes/veterinarioRoutes.js";
import PacienteRoutes from "./routes/pacienteRoutes.js";
import cors from "cors";

const App = express();
App.use(express.json());
dotenv.config();

connectDB();

const domainsAccept = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {
        if (domainsAccept.indexOf(origin) !== -1) {
            //El dominio esta en la lista de aceptados

            //Permitir acceso - callback (error, exito)
            callback(null, true);
        } else {
            //El dominio no esta en la lista de aceptados
            callback(new Error('Not allowed by CORS'));
        }
    }
};

// Avilitar cors para los dominios registrados
App.use(cors(corsOptions));

App.use('/api/veterinarios', VeterinarioRoutes);
App.use('/api/pacientes', PacienteRoutes);

const PORT = process.env.PORT || 4000;

App.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});