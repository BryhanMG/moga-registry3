const mongoose = require('mongoose');

//direccion de la base de datos
//const URI = 'mongodb://localhost:27017/moga';
const URI = '';
mongoose.connect(URI)
    .then(db => console.log('BD esta conectada'))
    .catch(err => console.error(err)); 

module.exports = mongoose;
