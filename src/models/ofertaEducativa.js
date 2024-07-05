import mongoose from 'mongoose';

const { Schema } = mongoose;

const ofertaEducativaSchema = new Schema({
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

export default mongoose.model('OfertaEducativa', ofertaEducativaSchema);
