const mongoos = require('mongoose');
const { Schema } = mongoos;

const administrador_regSchema = new Schema({
    _id: { type: String, required: true},
    rol: {type: Number, required: true},
    password: { type: String, required: true},
    eventos: { type: Array}
});

module.exports = mongoos.model('administradores_registro', administrador_regSchema);