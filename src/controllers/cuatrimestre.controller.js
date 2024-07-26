import Cuatrimestre from '../models/cuatrimestre.js';
import mongoose from 'mongoose';

export const getCuatrimestre = async (req, res) => {
    try {
        const cuatrimestres = await Cuatrimestre.find();
        res.json(cuatrimestres);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error en el servidor'});
    }
}

export const getCuatrimestreById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.cuatrimestreId)) {
            return res.status(400).json({ message: 'ID de cuatrimestre inválido' });
        }

        const cuatrimestre = await Cuatrimestre.findById(req.params.cuatrimestreId);
        if (!cuatrimestre) {
            return res.status(404).json({ message: 'El ID no corresponde a ningún cuatrimestre' });
        }
        res.json(cuatrimestre);
    } catch (error) {
        console.error('Error al obtener el cuatrimestre por ID:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const addCuatrimestre = async (req, res) => {
    try{
        const { nombre } = req.body;

        const newCuatrimestre = new Cuatrimestre({
            nombre
        });

        const cuatrimestreSave = await newCuatrimestre.save();
        res.status(201).json(cuatrimestreSave);

    } catch ( error ) {
        console.error('Error al crear el cuatrimestre: ', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
}


export const putCuatrimestre = async (req, res) => {
    try{
        const { nombre } = req.body;
        const updatedCuatrimestre = await Cuatrimestre.findByIdAndUpdate(req.params.cuatrimestreId, { nombre }, { new: true });
        if (!updatedCuatrimestre) {
            return res.status(404).json({ message: 'Cuatrimestre no encontrado' });
        }
        res.json(updatedCuatrimestre);
    } catch ( error ) {
        console.error('Error en editar el cuatrimestre: ', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
}

export const deleteCuatrimestre = async (req, res) => {
    try {
        const deletedCuatrimestre = await Cuatrimestre.findByIdAndDelete(req.params.cuatrimestreId);
        if (!deletedCuatrimestre) {
            return res.status(404).json({ message: 'Cuatrimestre no encontrado' });
        }
        res.json({ message: 'Cuatrimestre eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el custrimestre:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
}