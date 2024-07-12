import Admision from '../models/admision.js';
import OfertaEducativa from '../models/ofertaEducativa.js';
import mongoose from 'mongoose';

// Endpoint para relacionar admisiones con oferta educativa
export const linkAdmisionToOferta = async (req, res) => {
    try {
        const { admisionId, ofertaIds } = req.body;

        // Verificar si el ID de admisión es válido
        if (!mongoose.Types.ObjectId.isValid(admisionId)) {
            return res.status(400).json({ message: 'ID de admisión inválido' });
        }

        // Verificar si los IDs de ofertas educativas son válidos
        for (let ofertaId of ofertaIds) {
            if (!mongoose.Types.ObjectId.isValid(ofertaId)) {
                return res.status(400).json({ message: `ID de oferta educativa inválido: ${ofertaId}` });
            }
        }

        // Buscar la admisión por su ID
        const admision = await Admision.findById(admisionId);
        if (!admision) {
            return res.status(404).json({ message: 'Admision no encontrada' });
        }

        // Actualizar la admisión para incluir las ofertas educativas
        admision.ofertasEducativas = ofertaIds;
        await admision.save();

        // Actualizar las ofertas educativas para incluir la admisión
        for (let ofertaId of ofertaIds) {
            const oferta = await OfertaEducativa.findById(ofertaId);
            if (oferta) {
                if (!oferta.admisiones.includes(admisionId)) {
                    oferta.admisiones.push(admisionId);
                    await oferta.save();
                }
            }
        }

        res.json({ message: 'Admision y ofertas educativas vinculadas exitosamente' });
    } catch (error) {
        console.error('Error al vincular admision con oferta educativa:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
//Un komentario al final por k zi