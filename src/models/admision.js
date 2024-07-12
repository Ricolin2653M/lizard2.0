import { Schema, model } from "mongoose";

const admisionSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Admision', admisionSchema)