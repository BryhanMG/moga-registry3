const Usuario = require('../models/usuario');

const usuarioController = {};
//Archivo que solo tendra funciones
usuarioController.getUsuarios = async (req, res) => {
    const usuario = await Usuario.find();
    res.json(usuario);
};

usuarioController.crearUsuario = async(req, res)=>{
    const usuario = new Usuario(req.body);
    console.log(usuario);
    await usuario.save();
    res.json({
        'status': 'Usuario guardado'
    });
};

usuarioController.getUsuario =  async(req, res)=>{
    //console.log(req.params.id);
    const usuario = await Usuario.findById(req.params.id);
    res.json(usuario);
}

usuarioController.editUsuario = async(req, res)=>{
    const id = req.params.id;
    const usuario = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        correo: req.body.correo
    };
    console.log("Resultado: ");
    console.log(req.body);
    await Usuario.findByIdAndUpdate(id, {$set: usuario}, {new: true});
    res.json({status: 'Usuario actualizado'});
}

usuarioController.deleteUsuario = async(req, res)=>{
    await Usuario.findByIdAndRemove(req.params.id);
    res.json({status: 'Usuario eliminado'});
    
}


module.exports = usuarioController;