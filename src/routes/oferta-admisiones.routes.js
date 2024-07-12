import { Router } from "express";
import * as oferAdmi from "../controllers/oferta-admisiones.controller";

const router = Router();

router.get('/', (req, res) => {
    res.send(messages.Welcome)
});

router.post('/', oferAdmi.linkAdmisionToOferta);

export default router;