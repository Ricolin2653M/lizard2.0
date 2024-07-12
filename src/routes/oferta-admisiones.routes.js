import { Router } from "express";
import { linkAdmisionToOferta } from '../controllers/admisiones-oferta.controller.js';
import { authJwt } from "../middlewares/index.js";

const router = Router();


router.post('/', [authJwt.verifyToken, authJwt.isAdmin], linkAdmisionToOferta);

export default router;