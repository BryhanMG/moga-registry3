const mongoos = require('mongoose');
const { Schema } = mongoos;

const eventoRSchema = new Schema({
    id_er: {type: String, required: true},
    nombre_a: {type: String, required: true},
    fecha_i: {type: Date, required: true},
    fecha_f: {type: Date, required: true},
    descripcion: { type: String},
    estado: { type: String, required: true},
    tipo: { type: Number, required: true},
    total: { type: Number},
    monto: {type: Number},
    asistentes: { type: Array}
});


module.exports = mongoos.model('actividade', eventoRSchema );