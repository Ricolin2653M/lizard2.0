import Materia from '../models/materia.js';
import mongoose from 'mongoose';

export const getMaterias = async (req, res) => {
    try {
        const materias = await Materia.find();
        res.json(materias);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error en el servidor'});
    }
}

export const getMateriaById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.materiaId)) {
            return res.status(400).json({ message: 'ID de materia inválido' });
        }

        const materia = await Materia.findById(req.params.materiaId);
        if (!materia) {
            return res.status(404).json({ message: 'El ID no corresponde a ninguna materia' });
        }
        res.json(materia);
    } catch (error) {
        console.error('Error al obtener la materia por ID:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const addMateria = async (req, res) => {
    try{
        const { nombre, descripcion } = req.body;

        const newMateria = new Materia({
            nombre, 
            descripcion
        });

        const materiaSave = await newMateria.save();
        res.status(201).json(materiaSave);

    } catch ( error ) {
        console.error('Error al crear la materia: ', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
}

export const editMateria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const updatedMateria = await Materia.findByIdAndUpdate(req.params.materiaId, { nombre, descripcion }, { new: true });
        if (!updatedMateria) {
            return res.status(404).json({ message: 'Materia no encontrado' });
        }
        res.json(updatedMateria);
    } catch (error) {
        console.error('Error al actualizar la materia:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const deleteMateria = async (req, res) => {
    try {
        const deletedMateria = await Materia.findByIdAndDelete(req.params.materiaId);
        if (!deletedMateria) {
            return res.status(404).json({ message: 'Materia no encontrado' });
        }
        res.json({ message: 'Materia eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la materia:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}