import OfertaEducativa from '../models/ofertaEducativa.js';
import Admision from '../models/admision.js';
import mongoose from 'mongoose';

// Endpoint para vincular una admisión con una o varias ofertas educativas
export const linkAdmisionToOferta = async (req, res) => {
    try {
        // Verificar si se proporciona un array de admisionId y si contiene más de un elemento
        if (Array.isArray(req.body.admisionId) && req.body.admisionId.length > 1) {
            return res.status(400).json({ message: 'Solo se puede vincular una admisión a ofertas educativas a la vez' });
        }

        // Si es un array, tomar el primer elemento como admisionId
        const admisionId = Array.isArray(req.body.admisionId) ? req.body.admisionId[0] : req.body.admisionId;

        // Validar que el admisionId sea válido
        if (!mongoose.Types.ObjectId.isValid(admisionId)) {
            return res.status(400).json({ message: `ID de admisión inválido: ${admisionId}` });
        }

        // Validar que se proporcionen y sean válidos los ofertaIds
        if (!req.body.ofertaIds || !Array.isArray(req.body.ofertaIds)) {
            return res.status(400).json({ message: 'Se debe proporcionar al menos un ID de oferta educativa válido' });
        }

        // Obtener la admisión actual
        const admision = await Admision.findById(admisionId);
        if (!admision) {
            return res.status(404).json({ message: 'Admision no encontrada' });
        }

        // Obtener las ofertas educativas actuales asociadas a la admisión
        const ofertasEducativasActuales = admision.ofertasEducativas.map(oe => oe.toString());

        // Identificar las ofertas educativas que deben ser eliminadas
        const ofertaIdsEntrantes = req.body.ofertaIds.map(id => id.toString());
        const ofertasAEliminar = ofertasEducativasActuales.filter(oe => !ofertaIdsEntrantes.includes(oe));

        // Eliminar las ofertas educativas que ya no están presentes en req.body.ofertaIds
        if (ofertasAEliminar.length > 0) {
            admision.ofertasEducativas = admision.ofertasEducativas.filter(oe => !ofertasAEliminar.includes(oe.toString()));
            
            // Eliminar la referencia de admisionId en las ofertas educativas eliminadas
            for (let ofertaId of ofertasAEliminar) {
                const oferta = await OfertaEducativa.findById(ofertaId);
                if (oferta) {
                    oferta.admisiones = oferta.admisiones.filter(a => a.toString() !== admisionId.toString());
                    await oferta.save();
                }
            }
        }

        // Vincular las ofertas educativas recibidas con la admisión
        for (let ofertaId of req.body.ofertaIds) {
            if (!admision.ofertasEducativas.includes(ofertaId)) {
                admision.ofertasEducativas.push(ofertaId);
            }
        }

        await admision.save();

        // Actualizar las ofertas educativas con la admisión vinculada
        const ofertasEducativas = await OfertaEducativa.find({ _id: { $in: req.body.ofertaIds } });
        for (let oferta of ofertasEducativas) {
            if (!oferta.admisiones.includes(admisionId)) {
                oferta.admisiones.push(admisionId);
            }
            await oferta.save();
        }

        res.json({ message: 'Admisiones y ofertas educativas vinculadas exitosamente' });
    } catch (error) {
        console.error('Error al vincular admisiones con ofertas educativas:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}
