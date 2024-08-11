import nodemailer from 'nodemailer';

export const sendEmail = async (req, res) => {
    const { remitente, asunto, mensaje } = req.body;

    const pass = "tmbuvokzsamxzktw";
    const gmail_user = "carlosbr0320@gmail.com";
 

    // Configuración del transporte de nodemailer usando SMTP de Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmail_user, 
            pass: pass
        }
    });

    const mailOptions = {
        remitente,
        destinatario: gmail_user,
        asunto,
        mensaje
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo' });
    }
};
