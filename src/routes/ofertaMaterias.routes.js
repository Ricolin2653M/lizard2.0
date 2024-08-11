import { Router } from "express";
import * as ofertaMateriasCtrl from '../controllers/oferta-materias.controller.js';
import { authJwt } from "../middlewares/index.js";

const router = Router();

//Ruta para relacionar una oferta educativa con una o varias materias
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], ofertaMateriasCtrl.relacionarOfertaMaterias);
router.get('/:id/materias', ofertaMateriasCtrl.obtenerMateriasPorOferta);

export default router;