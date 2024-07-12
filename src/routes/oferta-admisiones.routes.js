import { Router } from "express";
import { linkAdmisionToOferta } from "../controllers/oferta-admisiones.controller";

const router = Router();

router.post('/link', linkAdmisionToOferta);

export default router;