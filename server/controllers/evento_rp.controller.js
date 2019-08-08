const EventoR = require('../models/evento_rp');


const EventoRController = {};
//Archivo que solo tendra funciones
EventoRController.getEventoRs = async (req, res) => {
    const eventoR = await EventoR.find();
    res.json(eventoR);
};

//Obtener la cantidad total de eventos existentes
EventoRController.getEventosCount = async (req, res) => {
    const eventoR = await EventoR.find().count();
    res.json(eventoR);
};

//Crear evento nuevo de registro
EventoRController.crearEventoR = async(req, res)=>{
    const eventoR = new EventoR(req.body);
    await eventoR.save();
    res.json({
        'status': 'Evento de registro creado'
    });
};

//Obtener evento especifico
EventoRController.getEventoR = async(req, res)=>{
    const {id} = req.params;
    const eventoR = await EventoR.findById({"_id": id}, {"votantes":0});
    res.json(eventoR);
}

//Actualizar evento
EventoRController.updateEvento = async(req, res)=>{
    const {id} = req.params;
    const eventoR = {
        nombre_er: req.body.nombre_er,
        fecha_i: req.body.fecha_i,
        fecha_f: req.body.fecha_f,
        descripcion: req.body.descripcion,
        categorias: req.body.categorias,
        monto: req.body.monto,
        campos: req.body.campos,
        
    };
    await EventoR.findByIdAndUpdate(id, {$set: eventoR}, {new: true});
    res.json({status: 'Estado del evento actualizados'});
}

//Actualizar terminar evento
EventoRController.updateTerminar = async(req, res)=>{
    
    const {id} = req.params;
    const eventoR = {
        fecha_f: req.body.fecha_f,
        estado: req.body.estado
    };
    await EventoR.findByIdAndUpdate(id, {$set: eventoR}, {new: true});
    res.json({status: 'Evento terminado'});
}

//Obtener un particioante especifico por su id
EventoRController.getParticipante = async(req, res)=>{
    const id = req.params.id;
    const pa = req.params.pa;
    console.log("id: "+id+" pa: "+pa)
    const evento = await EventoR.findById(id, {participantes: {$elemMatch: {_id: pa}}}, {new: true});
    res.json(evento);
}

//Obtener un particioante especifico por su boleta
EventoRController.getParticipanteBoleta = async(req, res)=>{
    const id = req.params.id;
    const bo = req.params.bo;
    console.log("id: "+id+" bo: "+bo)
    const evento = await EventoR.findById(id, {participantes: {$elemMatch: {boleta: bo}}}, {new: true});
    res.json(evento);
}

//Agregar un participante a la lista
EventoRController.addParticipante = async(req, res)=>{
    const {id} = req.params;
    const participante = {
        participantes: req.body.participantes
    };
    await EventoR.findByIdAndUpdate(id, {$push: {participantes: {$each: participante.participantes}}}, {new: true});
    res.json({status: 'Participante ingresado'});
}

//Quitar un participante del evento
EventoRController.quitParticipante = async(req, res)=>{
    const {id} = req.params;
    const participante = {
        participantes: req.body.participantes
    };
    await EventoR.findByIdAndUpdate(id, {$pull: {participantes: {$in: participante.participantes}}}, {new: true});
    res.json({status: 'Participante eliminado'});
}

//Actualizar el estado del evento
EventoRController.updateEstado = async(req, res)=>{
    const {id} = req.params;
    const eventoR = {
        estado: req.body.estado
    };
    await EventoR.findByIdAndUpdate(id, {$set: eventoR}, {new: true});
    res.json({status: 'Estado del evento actualizados'});
}

//Agregar un participante a la lista
EventoRController.addCategoria = async(req, res)=>{
    const {id} = req.params;
    const categoria = {
        categorias: req.body.categorias
    };
    await EventoR.findByIdAndUpdate(id, {$push: {categorias: {$each: ccategoria.categorias}}}, {new: true});
    res.json({status: 'Categoria ingresada'});
}

//Quitar un participante del evento
EventoRController.quitCategoria = async(req, res)=>{
    const {id} = req.params;
    const participante = {
        categorias: req.body.categorias
    };
    await EventoR.findByIdAndUpdate(id, {$pull: {participantes: {$in: categoria.categorias}}}, {new: true});
    res.json({status: 'Participante eliminado'});
}

module.exports = EventoRController;