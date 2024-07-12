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
    },
    admisiones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admision'
    }]
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('OfertaEducativa', ofertaEducativaSchema);
