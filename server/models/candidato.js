const mongoos = require('mongoose');
const { Schema } = mongoos;

const candidatoSchema = new Schema({
    
    id_ev: { type: String, required: true},
    rol: { type: String, required: true },
    candidatos: { type: Array, required: true },
    descripcion: { type: String}
    
});

module.exports = mongoos.model('candidato', candidatoSchema);