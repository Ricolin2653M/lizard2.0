import { Router } from 'express';
import * as divisionController from '../controllers/division.controller.js';

const router = Router();

router.post('/', divisionController.createDivision);
router.get('/', divisionController.getDivisions);
router.get('/:id', divisionController.getDivisionById);
router.put('/:id', divisionController.updateDivision);
router.delete('/:id', divisionController.deleteDivision);

export default router;