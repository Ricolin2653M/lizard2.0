import { Router } from "express";
import {linkAdmisionToOferta} from '../controllers/admisiones-oferta.controller.js';

const router = Router();


router.post('/',linkAdmisionToOferta);

export default router;