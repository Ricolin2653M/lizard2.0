import mongoose, { Schema, model } from "mongoose";

const publicacionSchema = new Schema({
    Titulo: {
        type: String,
        required: true
    },
    Descripcion: {
        type: String,
        required: true
    },
    Autor: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Publicacion', publicacionSchema)