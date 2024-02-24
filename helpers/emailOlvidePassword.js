import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
        }
    });
    
    const { email, nombre, token } = datos;
    
    //Enviar el email
    const info = await transport.sendMail({
        from: "APV - Administrador de Pacientes de Veterianaria ",
        to: email,
        subject: "Restablece tu contraseña",
        text: `Hola ${nombre}, has solicitado restablecer tu contraseña en APV`,
        html: `<p>Hola ${nombre}, restablece tu contraseña en APV.</p>
               <p>Sigue el siguiente enlace para restablecer tu contraseña: 
               <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer contraseña</a></p>




               
               <p>Si tu no solicitaste realizar un cambio de contrseña puedes ignorar este correo.</p>
        `
    })

    console.log("Message sent: %s", info.messageId)
}

export default emailOlvidePassword;