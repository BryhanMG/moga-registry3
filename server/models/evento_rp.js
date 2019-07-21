const mongoos = require('mongoose');
const { Schema } = mongoos;

const eventoRPSchema = new Schema({
    _id: { type: String, required: true},
    nombre_er: {type: String, required: true},
    fecha_i: {type: Date, required: true},
    fecha_f: {type: Date, required: true},
    descripcion: { type: String},
    estado: { type: String, required: true},
    categorias: {type: Array,},
    tipo: { type: String, required: true},
    monto: { type: String,},
    campos: { type: Array,},
    participantes: { type: Array},
    
});




module.exports = mongoos.model('evento_registro', eventoRPSchema );