import mongoose from 'mongoose';

const { Schema } = mongoose;

const profesorSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    numeroEmpleado: {
        type: String,
        required: true,
        unique: true // Para asegurar que no haya duplicados de número de empleado
    },
    correo: {
        type: String,
        required: true,
        unique: true // Para asegurar que no haya duplicados de correo
    },
    fechaNacimiento: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('Profesor', profesorSchema);
