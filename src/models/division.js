import mongoose from 'mongoose';

const { Schema } = mongoose;

const divisionSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    ofertasEducativas: [{
        type: Schema.Types.ObjectId,
        ref: 'OfertaEducativa'
    }]
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('Division', divisionSchema);