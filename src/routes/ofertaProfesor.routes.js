import { Router } from "express";
import * as ofertaProfesorCtrl from '../controllers/ofertaProfesor.controller.js';
import { authJwt } from "../middlewares/index.js";

const router = Router();

// Ruta para relacionar una oferta educativa con un profesor
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], ofertaProfesorCtrl.relacionarOfertaProfesor);


export default router;