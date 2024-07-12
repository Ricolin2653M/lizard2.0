import OfertaEducativa from '../models/ofertaEducativa.js';
import Profesor from '../models/profesor.js';

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

        // Verificar la existencia y validez de los IDs de profesores
        const profesorIds = req.body.profesorIds.map(id => mongoose.Types.ObjectId(id)); // Convertir a ObjectId

        // Buscar los profesores por sus IDs
        const profesores = await Profesor.find({ _id: { $in: profesorIds } });

        // Validar que se encontraron todos los profesores
        if (profesores.length !== profesorIds.length) {
            return res.status(404).json({ message: 'No se encontraron todos los profesores especificados' });
        }

        // Obtener la oferta educativa actual
        const oferta = await OfertaEducativa.findById(ofertaId);
        if (!oferta) {
            return res.status(404).json({ message: 'Oferta educativa no encontrada' });
        }

        // Obtener los profesores actuales asociados a la oferta educativa
        const profesoresActuales = oferta.profesores.map(p => p.toString());

        // Identificar los profesores que deben ser eliminados
        const profesorIdsEntrantes = profesorIds.map(id => id.toString());
        const profesoresAEliminar = profesoresActuales.filter(p => !profesorIdsEntrantes.includes(p));

        // Eliminar los profesores que ya no están presentes en req.body.profesorIds
        if (profesoresAEliminar.length > 0) {
            oferta.profesores = oferta.profesores.filter(p => !profesoresAEliminar.includes(p.toString()));

            // Eliminar la referencia de ofertaId en los profesores eliminados
            for (let profesorId of profesoresAEliminar) {
                const profesor = await Profesor.findById(profesorId);
                if (profesor) {
                    profesor.ofertasEducativas = profesor.ofertasEducativas.filter(o => o.toString() !== ofertaId.toString());
                    await profesor.save();
                }
            }
        }

        // Vincular los profesores recibidos con la oferta educativa
        for (let profesorId of profesorIds) {
            if (!oferta.profesores.includes(profesorId)) {
                oferta.profesores.push(profesorId);
            }
        }

        await oferta.save();

        // Actualizar los profesores con la oferta educativa vinculada
        for (let profesor of profesores) {
            if (!profesor.ofertasEducativas.includes(ofertaId)) {
                profesor.ofertasEducativas.push(ofertaId);
            }
            await profesor.save();
        }

        res.json({ message: 'Oferta educativa y profesores vinculados exitosamente' });
    } catch (error) {
        console.error('Error al vincular oferta educativa con profesores:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
