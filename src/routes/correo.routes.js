import { Router } from "express";
import { sendEmail } from '../controllers/correo.controller.js';

const router = Router();

// Ruta para enviar correos
router.post('/', sendEmail);

export default router;