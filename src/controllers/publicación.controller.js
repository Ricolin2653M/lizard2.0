import Publicacion from '../models/publicacion.js';
import mongoose from 'mongoose';

// Obtener todas las publicaciones
export const getPublicaciones = async (req, res) => {
    try {
        const publicaciones = await Publicacion.find();
        res.json(publicaciones);
    } catch (error) {
        console.error('Error al obtener publicaciones:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

// Obtener una publicación por su ID
export const getPublicacionById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.publicacionId)) {
            return res.status(400).json({ message: 'ID de publicación inválido' });
        }

        const publicacion = await Publicacion.findById(req.params.publicacionId);
        if (!publicacion) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.json(publicacion);
    } catch (error) {
        console.error('Error al obtener publicación por ID:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

// Crear una nueva publicación
export const createPublicacion = async (req, res) => {
    try {
        const { Titulo, Descripcion, Autor } = req.body;
        const newPublicacion = new Publicacion({ Titulo, Descripcion, Autor });
        const publicacionGuardada = await newPublicacion.save();
        res.status(201).json(publicacionGuardada);
    } catch (error) {
        console.error('Error al crear publicación:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}