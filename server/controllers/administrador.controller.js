const Admin = require('../models/administrador');

const adminsController = {};
//Archivo que solo tendra funciones
adminsController.getAdmins = async (req, res) => {
    const admin = await Admin.find();
    res.json(admin);
};

adminsController.getAdminPass = async (req, res) => {
    //console.log("usuario: "+req.params.id);
    const admin = await Admin.find({_id:{$eq:req.params.id}}, {eventos:0});;
    res.json(admin);
};

adminsController.getAdminLogin = async (req, res) => {
    //console.log("usuario: "+req.params.id);
    //console.log("password: "+req.params.pass);
    const admin = await Admin.find({_id:{$eq:req.params.id}, password:{$eq:req.params.pass}}, {password:0});
    res.json(admin);
};

adminsController.getAdminEventos = async (req, res) => {
    const admin = await Admin.find({_id:req.params.id}, {password:0});
    res.json(admin);
};

adminsController.crearAdmin = async(req, res)=>{
    const admin = new Admin(req.body);
    //console.log(admin);
    await admin.save();
    res.json({
        status: 'Administrador guardado'
    });
};

adminsController.getAdminsEventos = async(req, res)=>{
    const admin = await Admin.find({"rol": 2}, {password:0});
    res.json(admin);
}

adminsController.addAdminEvento = async(req, res)=>{
    const {id} = req.params;
    const admin = {
        eventos: req.body.eventos,
    };
    await Admin.findByIdAndUpdate(id, {$push: {eventos: {$each: admin.eventos}}}, {new: true});
    res.json({status: 'Evento ingresado'});
}

adminsController.updateAdminEventos = async(req, res)=>{
    const {id} = req.params;
    const admin = {
        eventos: req.body.eventos,
    };
    //console.log(candidato);
    await Admin.findByIdAndUpdate(id, {$set: admin}, {new: true});
    res.json({status: 'Administrador actualizado'});
}

adminsController.updateAdminPass = async(req, res)=>{
    const {id} = req.params;
    const admin = {
        password: req.body.password,
    };
    //console.log(candidato);
    await Admin.findByIdAndUpdate(id, {$set: admin}, {new: true});
    res.json({status: 'Administrador actualizado'});
}

adminsController.deleteAdmin = async(req, res)=>{
    await Admin.findByIdAndRemove(req.params.id);
    res.json({status: 'Administrador eliminado'});
}

module.exports = adminsController;