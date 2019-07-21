const AdminReg = require('../models/administrador_reg');

const adminRegsController = {};
//Archivo que solo tendra funciones
adminRegsController.getAdminRegs = async (req, res) => {
    const adminReg = await AdminReg.find();
    res.json(adminReg);
};


adminRegsController.getAdminRegPass = async (req, res) => {
    const adminReg = await AdminReg.find({_id:{$eq:req.params.id}}, {eventos:0});
    res.json(adminReg);
};

adminRegsController.getAdminRegLogin = async (req, res) => {
    const adminReg = await AdminReg.find({_id:{$eq:req.params.id}, password:{$eq:req.params.pass}}, {password:0});
    res.json(adminReg);
};

adminRegsController.crearAdminReg = async(req, res)=>{
    const adminReg = new AdminReg(req.body);
    console.log(adminReg);
    await adminReg.save();
    res.json({
        status: 'AdminRegistrador guardado'
    });
};

adminRegsController.updateAdminReg = async(req, res)=>{
    const {id} = req.params;
    const admin = {
        password: req.body.password,
    };
    await AdminReg.findByIdAndUpdate(id, {$set: admin}, {new: true});
    res.json({status: 'Administrador actualizado'});
}

adminRegsController.deleteAdminReg = async(req, res)=>{
    await AdminReg.findByIdAndRemove(req.params.id);
    res.json({status: 'AdminRegistrador eliminado'});
}

module.exports = adminRegsController;