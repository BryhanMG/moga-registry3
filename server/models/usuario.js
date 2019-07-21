const mongoos = require('mongoose');
const { Schema } = mongoos;

const usuarioSchema = new Schema({
    _id: { type: String, required: true},
    nombres: {type: String, required: true},
    apellidos: { type: String, required: true},
    correo: { type: String}
});

module.exports = mongoos.model('usuario', usuarioSchema);