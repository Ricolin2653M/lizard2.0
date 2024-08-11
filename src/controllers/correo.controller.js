import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (req, res) => {
    const { name, email, asunto, mensaje } = req.body;

    if (!name || !email || !asunto || !mensaje) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const mensajeNuevo = `Enviado por: ${name}\nCorreo: ${email}\n\n${mensaje}`;

    // Configuración del transporte de nodemailer usando SMTP de Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.PASS
        }
    });

    const mailOptions = {
        to: process.env.GMAIL_USER,
        subject: asunto,
        text: mensajeNuevo
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
    }
};
