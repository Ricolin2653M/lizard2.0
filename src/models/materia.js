import mongoose from 'mongoose';

const { Schema } = mongoose;

const materiaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    profesores: [{
        type: Schema.Types.ObjectId,
        ref: 'profesors'
    }],
    ofertasEducativas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfertaEducativa'
    }]
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('Materia', materiaSchema);