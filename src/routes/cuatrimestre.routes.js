import { Router } from "express";
const router = Router();
import * as cuatrimestrwCtrl from '../controllers/cuatrimestre.controller.js';
import { authJwt } from "../middlewares/index.js";

router.get("/", cuatrimestrwCtrl.getCuatrimestre);
router.get("/:cuatrimestreId", cuatrimestrwCtrl.getCuatrimestreById);
router.post("/",[authJwt.verifyToken,authJwt.isAdmin], cuatrimestrwCtrl.addCuatrimestre);
router.put('/:cuatrimestreId',[authJwt.verifyToken,authJwt.isAdmin], cuatrimestrwCtrl.putCuatrimestre);
router.delete('/:cuatrimestreId',[authJwt.verifyToken,authJwt.isAdmin], cuatrimestrwCtrl.deleteCuatrimestre);


export default router;