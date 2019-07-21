const mongoos = require('mongoose');
const { Schema } = mongoos;

const eventoSchema = new Schema({
    _id: { type: String, required: true},
    nombre_ev: {type: String, required: true},
    fecha_i: {type: Date, required: true},
    fecha_f: {type: Date, required: true},
    descripcion: { type: String},
    estado: { type: String, required: true},
    votantes: {type: Array}
})

module.exports = mongoos.model('evento_votacion', eventoSchema);