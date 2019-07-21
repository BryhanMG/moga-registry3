const Rol = require('../models/roles');

const rolController = {};
//Archivo que solo tendra funciones
rolController.getRol = async (req, res) => {
    const rol = await Rol.find();
    res.json(rol);
};



module.exports = rolController;