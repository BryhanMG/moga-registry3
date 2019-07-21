const Evento = require('../models/evento');
const mongoos = require('mongoose');

const evetoController = {};
//Archivo que solo tendra funciones

//Obtener todos los eventos
evetoController.getEventos = async (req, res) => {
    const evento = await Evento.find({},{"votantes":0});
    res.json(evento);
};

//Obtener la cantidad total de eventos existentes
evetoController.getEventosCount = async (req, res) => {
    const evento = await Evento.find().count();
    res.json(evento);
};

//Crear un evento
evetoController.crearEvento = async(req, res)=>{
    const evento = new Evento(req.body);
    console.log(evento);
    await evento.save();
    res.json({
        'status': 'Evento creado'
    });
};

//Obtener evento especifico con el id
evetoController.getEvento =  async(req, res)=>{
    //console.log(req.params.id);
    const {id} = req.params;
    const evento = await Evento.findById({"_id": id}, {"votantes":0});
    res.json(evento);
}

//Actualizar evento
evetoController.updateEvento = async(req, res)=>{
    const {id} = req.params;
    const evento = {
        nombre_ev: req.body.nombre_ev,
        fecha_i: req.body.fecha_i,
        fecha_f: req.body.fecha_f,
        descripcion: req.body.descripcion,
        estado: req.body.estado,
    };
    await Evento.findByIdAndUpdate(id, {$set: evento}, {new: true});
    res.json({status: 'Evento actualizado'});
}

//Obtener un votante del evento indicado
evetoController.getVotante = async(req, res)=>{
    const id = req.params.id;
    const vo = req.params.vo;
    //console.log("id: "+id+" vo: "+vo)
    const evento = await Evento.findById(id, {votantes: {$elemMatch: {_id: vo}}}, {new: true});
    res.json(evento);
}

//Agregar votante a un evento indicado
evetoController.addVotante = async(req, res)=>{
    const {id} = req.params;
    const votante = {
        votantes: req.body.votantes
    };
    console.log(votante);
    await Evento.findByIdAndUpdate(id, {$push: {votantes: {$each: votante.votantes}}}, {new: true});
    res.json({status: 'Votante ingresado'});
}

//Quitar un votante de un evento indicado
evetoController.quitVotante = async(req, res)=>{
    const {id} = req.params;
    const votante = {
        votantes: req.body.votantes
    };
    await Evento.findByIdAndUpdate(id, {$pull: {votantes: {$in: votante.votantes}}}, {new: true});
    res.json({status: 'Votante eliminado'});
}

//Obtener eventos filtrados por fecha y estado
evetoController.getEventosRevision = async (req, res) => {
    const evento = await Evento.find({"estado": req.params.ed}, {"votantes":0});
    res.json(evento);
};

//Actualizar el estado de un evento
evetoController.updateEstado = async(req, res)=>{
    const {id} = req.params;
    const {estado} = req.params.estado;
    const evento = {
        estado: req.body.estado
    };
    await Evento.findByIdAndUpdate(id, {$set: evento}, {new: true});
    res.json({status: 'Estado del evento actualizados'});
}


module.exports = evetoController;