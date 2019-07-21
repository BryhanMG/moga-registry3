const mongoos = require('mongoose');
const { Schema } = mongoos;

const rolSchema = new Schema({
    _id: { type: Number, required: true},
    nombre_ur: {type: String, required: true}
});

module.exports = mongoos.model('usuario_role', rolSchema);