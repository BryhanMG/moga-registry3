const mongoos = require('mongoose');
const { Schema } = mongoos;

const administradorSchema = new Schema({
    _id: { type: String, required: true},
    rol: {type: Number, required: true},
    password: { type: String, required: true},
    eventos: { type: Array}
});

module.exports = mongoos.model('administradore', administradorSchema);