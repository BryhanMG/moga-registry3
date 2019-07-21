const mongoos = require('mongoose');
const { Schema } = mongoos;

const maquinaSchema = new Schema({
    _id: {type: String, required: true},
    id_ev: {type: String, required: true},
    numero: {type: Number, required: true},
    codigo: { type: String, required: true},
    estado: { type: String, required: true}
});

module.exports = mongoos.model('maquina_votacion', maquinaSchema);