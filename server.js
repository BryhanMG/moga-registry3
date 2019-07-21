const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const { mongoose } = require('./server/database')

const app = express();


app.use(express.static(__dirname+'/dist/moga-registry'));
//settings
app.set('port', process.env.PORT || 27017);

//Midlewares
app.use(morgan('dev'));
app.use (express.json());
app.use(cors({origin: 'https://moga-registry.herokuapp.com/'}));

//Routes
app.use('/api/usuarios',require('./server/routes/usuarios.routes'));
app.use('/api/eventos', require('./server/routes/eventos.routes'));
app.use('/api/eventos_r', require('./server/routes/eventos_rp.routes'));
app.use('/api/roles', require('./server/routes/roles.routes'));
app.use('/api/admins', require('./server/routes/administradores.routes'));
app.use('/api/admins_reg', require('./server/routes/administradores_reg.routes'));
app.use('/api/candidatos', require('./server/routes/condidatos.routes'));
app.use('/api/maquinas', require('./server/routes/maquinas.routes'));
app.use('/api/actividades', require('./server/routes/actividades.routes'));
app.use('/api/imagenes', require('./server/routes/imagenes.routes'));
app.use('/api/login', require('./server/routes/login.routes'));

// Empezar el servidor
app.listen(app.get('port'), () => {
    console.log('Server on port: ', app.get('port'));
});

//PathLocationStrategy
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/moga-registry/index.html')) 
 }); 
 
 console.log('Console escuchando!');


 

 
