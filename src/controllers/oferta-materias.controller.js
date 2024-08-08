import mongoose from 'mongoose';
import OfertaEducativa from '../models/ofertaEducativa.js';
import Materia from '../models/materia.js';

export const relacionarOfertaMaterias = async (req, res) => {
    try {
        // Verificar si se proporciona un array de ofertaId y si contiene más de un elemento
        if (Array.isArray(req.body.ofertaId) && req.body.ofertaId.length > 1) {
            return res.status(400).json({ message: 'Solo se puede vincular una oferta educativa a materias a la vez' });
        }

        // Si es un array, tomar el primer elemento como ofertaId
        const ofertaId = Array.isArray(req.body.ofertaId) ? req.body.ofertaId[0] : req.body.ofertaId;

        // Validar que el ofertaId sea válido
        if (!mongoose.Types.ObjectId.isValid(ofertaId)) {
            return res.status(400).json({ message: `ID de oferta educativa inválido: ${ofertaId}` });
        }

        // Validar que se proporcionen y sean válidos los materiaIds
        if (!req.body.materiaIds || !Array.isArray(req.body.materiaIds)) {
            return res.status(400).json({ message: 'Se debe proporcionar al menos un ID de materia válido' });
        }

        // Verificar que cada materiaId sea válido
        for (let materiaId of req.body.materiaIds) {
            if (!mongoose.Types.ObjectId.isValid(materiaId)) {
                return res.status(400).json({ message: `ID de materia inválido: <${materiaId}>` });
            }
        }

        // Obtener la oferta actual
        const oferta = await OfertaEducativa.findById(ofertaId);
        if (!oferta) {
            return res.status(404).json({ message: 'Oferta educativa no encontrada' });
        }

        // Obtener las materias actuales asociadas a la oferta educativa
        const materiasActuales = oferta.materias.map(m => m.toString());

        // Identificar las materias que deben ser eliminadas
        const materiasIdsEntrantes = req.body.materiaIds.map(id => id.toString());
        const materiasAEliminar = materiasActuales.filter(m => !materiasIdsEntrantes.includes(m));

        // Eliminar las materias que ya no están presentes en req.body.materiaIds
        if (materiasAEliminar.length > 0) {
            oferta.materias = oferta.materias.filter(p => !materiasAEliminar.includes(p.toString()));

            // Eliminar la referencia de ofertaId en las materias eliminadas
            for (let materiaId of materiasAEliminar) {
                const materia = await Materia.findById(materiaId);
                if (materia) {
                    materia.ofertasEducativas = materia.ofertasEducativas.filter(o => o.toString() !== ofertaId.toString());
                    await materia.save();
                }
            }
        }

        // Vincular las materias recibidos con la oferta educativa
        for (let materiaId of req.body.materiaIds) {
            if (!oferta.materias.includes(materiaId)) {
                oferta.materias.push(materiaId);
            }
        }

        await oferta.save();

        // Actualizar las materias con la oferta educativa vinculada
        const materias = await Materia.find({ _id: { $in: req.body.materiaIds } });
        for (let materia of materias) {
            if (!materia.ofertasEducativas.includes(ofertaId)) {
                materia.ofertasEducativas.push(ofertaId);
            }
            await materia.save();
        }

        res.status(200).json({ message: 'Oferta educativa y materias vinculados exitosamente' });
    } catch (error) {
        console.error('Error al vincular oferta educativa con materias:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}