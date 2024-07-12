import OfertaEducativa from '../models/ofertaEducativa.js';
import Admision from '../models/admision.js';
import mongoose from 'mongoose';

// Endpoint para vincular una admisión con una o varias ofertas educativas
export const linkAdmisionToOferta = async (req, res) => {
    try {
        // Verificar si se proporciona un único admisionId
        if (!req.body.admisionId || !mongoose.Types.ObjectId.isValid(req.body.admisionId)) {
            return res.status(400).json({ message: 'ID de admisión inválido' });
        }

        // Verificar si se proporciona un array de ofertaIds
        if (!req.body.ofertaIds || !Array.isArray(req.body.ofertaIds) || req.body.ofertaIds.length === 0) {
            return res.status(400).json({ message: 'Se debe proporcionar al menos un ID de oferta educativa válido' });
        }

        // Verificar si hay más de un admisionId
        if (req.body.ofertaIds.length > 1) {
            return res.status(400).json({ message: 'Solo se puede vincular una admisión a una o varias ofertas educativas en una solicitud' });
        }

        const admision = await Admision.findById(req.body.admisionId);
        if (!admision) {
            return res.status(404).json({ message: 'Admision no encontrada' });
        }

        const ofertasEducativas = await OfertaEducativa.find({ _id: { $in: req.body.ofertaIds } });
        if (ofertasEducativas.length !== req.body.ofertaIds.length) {
            return res.status(404).json({ message: 'No se encontraron todas las ofertas educativas especificadas' });
        }

        // Vincular la admisión con las ofertas educativas
        admision.ofertasEducativas = req.body.ofertaIds;
        await admision.save();

        // Actualizar las ofertas educativas con la admisión vinculada
        for (let ofertaId of req.body.ofertaIds) {
            const oferta = await OfertaEducativa.findById(ofertaId);
            if (oferta) {
                if (!oferta.admisiones.includes(req.body.admisionId)) {
                    oferta.admisiones.push(req.body.admisionId);
                    await oferta.save();
                }
            }
        }

        res.json({ message: 'Admision y ofertas educativas vinculadas exitosamente' });
    } catch (error) {
        console.error('Error al vincular admisión con oferta educativa:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

//Un komentario al final por k zi