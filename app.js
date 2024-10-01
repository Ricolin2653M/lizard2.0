import * as messages from "./Art/Messages.js";
import express from 'express';
const app = express();
app.use(express.json());

//crear roles por defecto
import { createRoles } from './src/libs/initialSetup.js';
createRoles();

//Ruta inicial
app.get('/', (req, res) =>{
    res.send(messages.Welcome)
});


/* 
 ######                             
 #     # #    # #####   ##    ####  
 #     # #    #   #    #  #  #      
 ######  #    #   #   #    #  ####  
 #   #   #    #   #   ######      # 
 #    #  #    #   #   #    # #    # 
 #     #  ####    #   #    #  ####  
                                    
*/
import admisionRoutes from './src/routes/admision.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import ofertaRoutes from './src/routes/oferta.routes.js'
import profesorRoutes from './src/routes/profesor.routes.js'
import userRoutes from './src/routes/user.routes.js'
import admisionesOferta from './src/routes/oferta-admisiones.routes.js';
import ofertaProfe from './src/routes/ofertaProfesor.routes.js';
import divisionRoutes from './src/routes/division.routes.js';
import cuatrimateofe from './src/routes/cuatri-mate-ofe.routes.js'
import materiaRoutes from './src/routes/materia.routes.js';
import cuatrimestreRoutes from './src/routes/cuatrimestre.routes.js';
import ofertaMaterias from './src/routes/ofertaMaterias.routes.js';
import envioCorreo from "./src/routes/correo.routes.js";

app.use('/api/admision', admisionRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/oferta',ofertaRoutes);
app.use('/api/profesores',profesorRoutes);
app.use('/api/users',userRoutes);
app.use('/api/oferadmi',admisionesOferta);
app.use('/api/ofertaprofe',ofertaProfe);
app.use('/api/divisiones', divisionRoutes);
app.use('/api/cmo', cuatrimateofe);
app.use('/api/materia', materiaRoutes);
app.use('/api/cuatrimestre', cuatrimestreRoutes);
app.use('/api/ofermat',ofertaMaterias);
app.use('/api/correo', envioCorreo);

export default app;