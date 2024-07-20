import Division from '../models/division.js';
import OfertaEducativa from '../models/ofertaEducativa.js';

export const createDivision = async (req, res) => {
    try {
        const { nombre, descripcion, ofertasEducativas } = req.body;
        const newDivision = new Division({ nombre, descripcion, ofertasEducativas });
        const savedDivision = await newDivision.save();
        res.status(201).json(savedDivision);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getDivisions = async (req, res) => {
    try {
        const divisions = await Division.find()
            .populate({
                path: 'ofertasEducativas',
                populate: [
                    {
                        path: 'admisiones',
                        select: 'nombre'
                    },
                    {
                        path: 'profesores',
                        select: 'nombre'
                    }
                ]
            });
        
        const formattedDivisions = divisions.map(division => ({
            ...division.toObject(),
            ofertasEducativas: division.ofertasEducativas.map(oferta => ({
                ...oferta.toObject(),
                admisiones: oferta.admisiones.map(adm => adm.nombre),
                profesores: oferta.profesores.map(prof => prof.nombre)
            }))
        }));

        res.status(200).json(formattedDivisions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getDivisionById = async (req, res) => {
    try {
        const division = await Division.findById(req.params.id)
            .populate({
                path: 'ofertasEducativas',
                populate: [
                    {
                        path: 'admisiones',
                        select: 'nombre'
                    },
                    {
                        path: 'profesores',
                        select: 'nombre'
                    }
                ]
            });

        if (!division) return res.status(404).json({ message: "División no encontrada" });

        const formattedDivision = {
            ...division.toObject(),
            ofertasEducativas: division.ofertasEducativas.map(oferta => ({
                ...oferta.toObject(),
                admisiones: oferta.admisiones.map(adm => adm.nombre),
                profesores: oferta.profesores.map(prof => prof.nombre)
            }))
        };

        res.status(200).json(formattedDivision);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateDivision = async (req, res) => {
    try {
        const updatedDivision = await Division.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDivision) return res.status(404).json({ message: "División no encontrada" });
        res.status(200).json(updatedDivision);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteDivision = async (req, res) => {
    try {
        const deletedDivision = await Division.findByIdAndDelete(req.params.id);
        if (!deletedDivision) return res.status(404).json({ message: "División no encontrada" });
        res.status(200).json({ message: "División eliminada con éxito" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};