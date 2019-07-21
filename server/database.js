const mongoose = require('mongoose');

//direccion de la base de datos
//const URI = 'mongodb://localhost:27017/moga';
const URI = 'mongodb+srv://bryan:Pato123456@clustermoga-llumz.mongodb.net/moga?retryWrites=true';
mongoose.connect(URI)
    .then(db => console.log('BD esta conectada'))
    .catch(err => console.error(err)); 

module.exports = mongoose;
