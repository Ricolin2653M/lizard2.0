import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (req, res) => {
    const { remitente, asunto, mensaje } = req.body;

    const mensajeNuevo = "Enviado por: " + remitente + "\n\n" + mensaje;


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
        res.status(500).json({ message: 'Error al enviar el correo' });
    }
};
