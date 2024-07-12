import { Router } from "express";
import * as oferAdmi from "../controllers/oferta-admisiones.controller";

const router = Router();

router.post('/', oferAdmi.linkAdmisionToOferta);

export default router;