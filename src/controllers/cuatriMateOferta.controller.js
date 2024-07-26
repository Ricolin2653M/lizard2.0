import OfertaEducativa from '../models/ofertaEducativa.js';
import Materia from '../models/materia.js';
import Cuatrimestre from '../models/cuatrimestre.js';
import mongoose from 'mongoose';

// Endpoint para vincular una oferta educativa con varias materias y un cuatrimestre
export const vincCuatriMateOfe = async (req, res) => {
    try {
        const { ofertaID, materiasID, cuatrimestreID } = req.body;

        // Verificar si se proporciona una ofertaID
        if (!ofertaID) {
            return res.status(400).json({ message: 'Debe proporcionar un ID de oferta educativa' });
        }

        // Validar que el ofertaID sea válido
        if (!mongoose.Types.ObjectId.isValid(ofertaID)) {
            return res.status(400).json({ message: `ID de oferta educativa inválido: ${ofertaID}` });
        }

        // Validar que se proporcionen y sean válidos los materiasID
        if (!materiasID || !Array.isArray(materiasID) || materiasID.length === 0) {
            return res.status(400).json({ message: 'Se debe proporcionar al menos un ID de materia válido' });
        }

        // Validar que cada materiaID sea válido
        for (const materiaID of materiasID) {
            if (!mongoose.Types.ObjectId.isValid(materiaID)) {
                return res.status(400).json({ message: `ID de materia inválido: ${materiaID}` });
            }
        }

        // Validar que se proporcione un cuatrimestreID y sea válido
        if (!cuatrimestreID || !mongoose.Types.ObjectId.isValid(cuatrimestreID)) {
            return res.status(400).json({ message: `ID de cuatrimestre inválido: ${cuatrimestreID}` });
        }

        // Buscar y actualizar el cuatrimestre con la oferta y materias
        const cuatrimestre = await Cuatrimestre.findById(cuatrimestreID);
        if (!cuatrimestre) {
            return res.status(404).json({ message: 'Cuatrimestre no encontrado' });
        }

        console.log('Cuatrimestre antes de la actualización:', cuatrimestre);

        cuatrimestre.ofertaEducativa = [ofertaID];
        cuatrimestre.materia = materiasID;

        console.log('Cuatrimestre después de asignar oferta y materias:', cuatrimestre);

        await cuatrimestre.save();

        console.log('Cuatrimestre después de guardar:', cuatrimestre);

        res.status(200).json({ message: 'Vinculación exitosa', cuatrimestre });
    } catch (error) {
        console.error('Error al vincular la oferta educativa con materias y cuatrimestre:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}
