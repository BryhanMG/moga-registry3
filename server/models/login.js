const mongoos = require('mongoose');
const { Schema } = mongoos;

const loginSchema = new Schema({
    _id: { type: String, required: true},
    password: { type: String, required: true}
});

module.exports = mongoos.model('login', loginSchema);