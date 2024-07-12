import OfertaEducativa from '../models/ofertaEducativa.js';
import Admision from '../models/admision.js';
import mongoose from 'mongoose';

// Endpoint para vincular una admisión con una o varias ofertas educativas
export const linkAdmisionToOferta = async (req, res) => {
    try {
        // Verificar si se proporciona un único admisionId o un array de admisionIds
        let admisionIds = [];
        if (Array.isArray(req.body.admisionId)) {
            admisionIds = req.body.admisionId;
        } else {
            admisionIds = [req.body.admisionId];
        }

        // Validar que todos los admisionIds sean válidos
        for (let admisionId of admisionIds) {
            if (!mongoose.Types.ObjectId.isValid(admisionId)) {
                return res.status(400).json({ message: `ID de admisión inválido: ${admisionId}` });
            }
        }

        // Verificar si se proporciona un array de ofertaIds
        if (!req.body.ofertaIds || !Array.isArray(req.body.ofertaIds) || req.body.ofertaIds.length === 0) {
            return res.status(400).json({ message: 'Se debe proporcionar al menos un ID de oferta educativa válido' });
        }

        const admisiones = await Admision.find({ _id: { $in: admisionIds } });
        if (admisiones.length !== admisionIds.length) {
            return res.status(404).json({ message: 'No se encontraron todas las admisiones especificadas' });
        }

        const ofertasEducativas = await OfertaEducativa.find({ _id: { $in: req.body.ofertaIds } });
        if (ofertasEducativas.length !== req.body.ofertaIds.length) {
            return res.status(404).json({ message: 'No se encontraron todas las ofertas educativas especificadas' });
        }

        // Vincular cada admisión con las ofertas educativas correspondientes
        for (let admisionId of admisionIds) {
            const admision = admisiones.find(admision => admision._id.toString() === admisionId.toString());
            if (admision) {
                for (let ofertaId of req.body.ofertaIds) {
                    if (!admision.ofertasEducativas.includes(ofertaId)) {
                        admision.ofertasEducativas.push(ofertaId);
                    }
                }
                await admision.save();
            }
        }

        // Actualizar las ofertas educativas con las admisiones vinculadas
        for (let ofertaId of req.body.ofertaIds) {
            const oferta = ofertasEducativas.find(oferta => oferta._id.toString() === ofertaId.toString());
            if (oferta) {
                for (let admisionId of admisionIds) {
                    if (!oferta.admisiones.includes(admisionId)) {
                        oferta.admisiones.push(admisionId);
                    }
                }
                await oferta.save();
            }
        }

        res.json({ message: 'Admisiones y ofertas educativas vinculadas exitosamente' });
    } catch (error) {
        console.error('Error al vincular admisiones con ofertas educativas:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}
