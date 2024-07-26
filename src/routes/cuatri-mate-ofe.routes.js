import { Router } from "express";
import { vincCuatriMateOfe } from '../controllers/cuatriMateOferta.controller.js';
import { authJwt } from "../middlewares/index.js";

const router = Router();


router.post('/', [authJwt.verifyToken, authJwt.isAdmin], vincCuatriMateOfe);

export default router;