import { Router } from "express";
const router = Router();

import * as materiaCtrl from '../controllers/materia.controller.js';

import { authJwt } from "../middlewares/index.js";
import materia from "../models/materia.js";

router.get('/', materiaCtrl.getMaterias);
router.get('/:materiaId', materiaCtrl.getMateriaById);
router.post('/',[authJwt.verifyToken,authJwt.isAdmin],materiaCtrl.addMateria);
router.put("/:materiaId",[authJwt.verifyToken,authJwt.isAdmin],materiaCtrl.editMateria);
router.delete('/:materiaId',[authJwt.verifyToken,authJwt.isAdmin],materiaCtrl.deleteMateria)

export default router;