import Admision from '../models/admision.js';
import mongoose from 'mongoose';

export const getAdmisiones = async (req, res) => {
    try {
        const admisiones = await Admision.find().populate({
            path: 'ofertasEducativas',
            select: 'nombre' // Seleccionar solo el campo 'nombre' de la oferta educativa
        });

        // Mapear las ofertas educativas para obtener solo los nombres en lugar de objetos completos
        const formattedAdmisiones = admisiones.map(admision => ({
            ...admision.toObject(),
            ofertasEducativas: admision.ofertasEducativas.map(oferta => oferta.nombre)
        }));

        res.json(formattedAdmisiones);
    } catch (error) {
        console.error('Error al obtener admisiones:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

// Obtener una admisión por su ID
export const getAdmisionById = async (req, res) => {
    try {
        // Verificar si el ID proporcionado es válido
        if (!mongoose.Types.ObjectId.isValid(req.params.admisionId)) {
            return res.status(400).json({ message: 'ID de admisión inválido' });
        }

        const admision = await Admision.findById(req.params.admisionId);
        if (!admision) {
            return res.status(404).json({ message: 'Admision no encontrada' });
        }
        res.json(admision);
    } catch (error) {
        console.error('Error al obtener admision por ID:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const createAdmision = async (req, res) =>{
    try{    
        const {nombre, activo} = req.body;
        const newAdmision = new Admision({nombre,activo});
        const admisionSave = await newAdmision.save();
        res.status(201).json(admisionSave);
    } catch (error) {
        console.error('Error al crear admision:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const updateAdmision = async (req, res) => {
    try {
        const { nombre, activo } = req.body;
        const updatedAdmision = await Admision.findByIdAndUpdate(req.params.admisionId, { nombre, activo }, { new: true });
        if (!updatedAdmision) {
            return res.status(404).json({ message: 'Admision no encontrada' });
        }
        res.json(updatedAdmision);
    } catch (error) {
        console.error('Error al actualizar admision:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const deleteAdmision = async (req, res) => {
    try {
        const deletedAdmision = await Admision.findByIdAndDelete(req.params.admisionId);
        if (!deletedAdmision) {
            return res.status(404).json({ message: 'Admision no encontrada' });
        }
        res.json({ message: 'Admision borrada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar admision:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}