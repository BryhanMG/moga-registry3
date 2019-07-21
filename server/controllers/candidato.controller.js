const Candidato = require('../models/candidato');

const candidatoController = {};
//Archivo que solo tendra funciones
candidatoController.getCandidatos = async (req, res) => {
    const candidato = await Candidato.find();
    res.json(candidato);
};

candidatoController.crearCandidato = async(req, res)=>{
    const candidato = new Candidato(req.body);
    console.log(candidato);
    await candidato.save();
    res.json({
        status: 'Candidato guardado'
    });
};

candidatoController.updateCandidato = async(req, res)=>{
    //console.log("Se llega a actualizar");
    const {id} = req.params;
    const candidato = {
        id_ev: req.body.id_ev,
        rol: req.body.rol,
        descripcion: req.body.descripcion,
        candidatos: req.body.candidatos,
    };
    console.log(candidato);
    await Candidato.findByIdAndUpdate(id, {$set: candidato}, {new: true});
    res.json({status: 'Candidato actualizado'});
};

candidatoController.addCandidato = async(req, res)=>{
    const {id} = req.params;
    const candidato = {
        candidatos: req.body.candidatos
    };
    await Candidato.findByIdAndUpdate(id, {$push: {candidatos: {$each: candidato.candidatos}}}, {new: true});
    res.json({status: 'Votante actualizado'});
    
}

candidatoController.getAllCandidato = async(req, res)=>{
    const candidato = await Candidato.find({"id_ev": req.params.id});
    res.json(candidato);
}

candidatoController.getCandidato = async(req, res)=>{
    const candidato = await Candidato.findById(req.params.id);
    res.json(candidato);
}

candidatoController.quitCandidato = async(req, res)=>{
    const {id} = req.params;
    const candidato = {
        candidatos: req.body.candidatos
    };
    await Candidato.findByIdAndUpdate(id, {$pull: {candidatos: {$in: candidato.candidatos}}}, {new: true});
    res.json({status: 'Candidato eliminado'});

}

candidatoController.deleteCandidatoRol = async(req, res)=>{
    await Candidato.findByIdAndRemove(req.params.id);
    res.json({status: 'Rol de candidato eliminado'});
}

module.exports = candidatoController;