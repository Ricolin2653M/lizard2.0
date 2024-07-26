import mongoose from 'mongoose';

const { Schema } = mongoose;

const cuatrimestreSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    materia: [{
        type: Schema.Types.ObjectId,
        ref: 'materias'
    }],
    ofertaEducativa: [{
        type: Schema.Types.ObjectId,
        ref: 'ofertaeducativas'
    }]
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('Cuatrimestre', cuatrimestreSchema);