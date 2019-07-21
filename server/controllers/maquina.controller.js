const Maquina = require('../models/maquina');

const MaquinaController = {};
//Archivo que solo tendra funciones
MaquinaController.getMaquinas = async (req, res) => {
    const maquina = await Maquina.find({"id_ev": req.params.id});
    res.json(maquina);
};

MaquinaController.crearMaquina = async(req, res)=>{
    const maquina = new Maquina(req.body);
    console.log(maquina);
    await maquina.save();
    res.json({
        'status': 'Maquina guardada'
    });
};

MaquinaController.getMaquinaLogin = async(req, res)=>{
    const maquina = await Maquina.findById(req.params.id);
    res.json(maquina);
}

MaquinaController.updateMaquina = async(req, res)=>{
    const maquina ={
        estado: req.body.estado,
    }
    await Maquina.findByIdAndUpdate(req.params.id, {$set: maquina}, {new: true});
    res.json({status: 'Maquina actualizada'});
}

MaquinaController.deleteMaquina = async(req, res)=>{
    await Maquina.findByIdAndRemove(req.params.id);
    res.json({status: 'Maquina para punto de votacion eliminada'});
}

module.exports = MaquinaController;