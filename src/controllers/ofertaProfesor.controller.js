import OfertaEducativa from '../models/ofertaEducativa.js';
import Profesor from '../models/profesor.js';
import mongoose from 'mongoose';

export const relacionarOfertaProfesor = async (req, res) => {
    try {
        // Verificar si se proporciona un array de ofertaId y si contiene más de un elemento
        if (Array.isArray(req.body.ofertaId) && req.body.ofertaId.length > 1) {
            return res.status(400).json({ message: 'Solo se puede vincular una oferta educativa a profesores a la vez' });
        }

        // Si es un array, tomar el primer elemento como ofertaId
        const ofertaId = Array.isArray(req.body.ofertaId) ? req.body.ofertaId[0] : req.body.ofertaId;

        // Validar que el ofertaId sea válido
        if (!mongoose.Types.ObjectId.isValid(ofertaId)) {
            return res.status(400).json({ message: `ID de oferta educativa inválido: ${ofertaId}` });
        }

        // Validar que se proporcionen y sean válidos los profesorIds
        if (!req.body.profesorIds || !Array.isArray(req.body.profesorIds)) {
            return res.status(400).json({ message: 'Se debe proporcionar al menos un ID de profesor válido' });
        }

        // Obtener la oferta actual
        const oferta = await OfertaEducativa.findById(admisionId);
        if (!oferta) {
            return res.status(404).json({ message: 'Oferta educativa no encontrada' });
        }

        // Obtener los profesores actuales asociadas a la oferta educativa
        const profesoresActuales = oferta.profesores.map(oe => oe.toString());

        // Identificar los profesores que deben ser eliminadas
        const profesoresIdsEntrantes = req.body.profesorIds.map(id => id.toString());
        const profesoresAEliminar = profesoresActuales.filter(oe => !profesoresIdsEntrantes.includes(oe));

        // Eliminar los profesores que ya no están presentes en req.body.profesorIds
        if (profesoresAEliminar.length > 0) {
            oferta.profesores = oferta.profesores.filter(oe => !profesoresAEliminar.includes(oe.toString()));
            
            // Eliminar la referencia de ofertaID en los profesores eliminadas
            for (let profesorId of profesoresAEliminar) {
                const profesor = await profesores.findById(profesorId);
                if (profesor) {
                    profesor.ofertasEducativas = profesor.ofertasEducativas.filter(a => a.toString() !== ofertaId.toString());
                    await profesor.save();
                }
            }
        }

        // Vincular los profesores recibidos con la oferta educativa
        for (let profesorId of req.body.profesorIds) {
            if (!oferta.profesores.includes(profesorId)) {
                oferta.profesores.push(profesorId);
            }
        }

        await oferta.save();

        // Actualizar los profesores con la oferta educativa vinculada
        const profesores = await Profesor.find({ _id: { $in: req.body.profesorIds } });
        for (let profesor of profesores) {
            if (!profesor.profesores.includes(ofertaId)) {
                profesor.profesores.push(ofertaId);
            }
            await oferta.save();
        }

        res.json({ message: 'Oferta educativa y profesores vinculados exitosamente' });
    } catch (error) {
        console.error('Error al vincular oferta educativa con profesores:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
