const mongoos = require('mongoose');
const { Schema } = mongoos;

const imagenSchema = new Schema({
    imagen: {type: String, required: true}
})

module.exports = mongoos.model('imagene', imagenSchema);