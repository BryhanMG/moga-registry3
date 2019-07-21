const Login = require('../models/login');

const loginController = {};
//Archivo que solo tendra funciones
//obtener login
loginController.getLogin = async (req, res) => {
    const login = await Login.findById(req.params.id);
    res.json(login);
};

//Guardar login
loginController.postLogin = async (req, res) => {
    const login = new Login(req.body);
    //console.log(login);
    await login.save();
    res.json({
        'status': 'Login registrado'
    });
};

//Eliminar login
loginController.deleteLogin = async (req, res) => {
    await Login.findByIdAndRemove(req.params.id);
    res.json({status: 'Se cerró sesión'});
};


module.exports = loginController;