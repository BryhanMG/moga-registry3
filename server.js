const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname+'/dist/moga-registry'));
app.set('port', process.env.PORT || 5000);

// Empezar el servidor
app.listen(app.get('port'), () => {
    console.log('Server on port: ', app.get('port'));
});

//PathLocationStrategy
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/moga-registry/index.html')) 
 }); 
 
 console.log('Console escuchando!');