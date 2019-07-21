const Actividad = require('../models/actividad');

const ActividadesController = {};
//Archivo que solo tendra funciones

ActividadesController.getActividades = async (req, res) => {
    const actividad = await Actividad.find();
    res.json(actividad);
};

ActividadesController.crearActividad = async(req, res)=>{
    const actividad = new Actividad(req.body);
    console.log(actividad);
    await actividad.save();
    res.json({
        'status': 'Actividad guardado'
    });
};

ActividadesController.getActividad = async(req, res)=>{
    const actividad = await Actividad.findById(req.params.id);
    res.json(actividad);
}

ActividadesController.getAllActividadesEditar = async(req, res)=>{
    const actividad = await Actividad.find({"id_er": req.params.id}, {"asistentes":0});
    res.json(actividad);
}

ActividadesController.updateActividad = async(req, res)=>{
    const {id} = req.params;
    const actividad = {
        nombre_a: req.body.nombre_a,
        fecha_i: req.body.fecha_i,
        fecha_f: req.body.fecha_f,
        descripcion: req.body.descripcion,
        estado: req.body.estado,
        tipo: req.body.tipo,        
    };
    await Actividad.findByIdAndUpdate(id, {$set: actividad}, {new: true});
    res.json({status: 'Actividad actualizada'});
}

//Eliminar una actividad
ActividadesController.deleteActividad = async(req, res)=>{
    await Actividad.findByIdAndRemove(req.params.id);
    res.json({status: 'Actividad eliminada'});
}

//Obtener todos los asistentes
ActividadesController.getAllAsistentes = async(req, res)=>{
    const actividad = await Actividad.find({"_id": req.params.id}, {"asistentes":1});
    res.json(actividad);
}

//Insertar un asistente
ActividadesController.addAsistente = async(req, res)=>{
    console.log(req.body);
    const {id} = req.params;
    const asistente = {
        asistentes: req.body.asistentes
    };
    await Actividad.findByIdAndUpdate(id, {$push: {asistentes: {$each: asistente.asistentes}}}, {new: true});
    res.json({status: 'Asistente ingresado a la actividad'});
}


//Eliminar participante
ActividadesController.quitAsistente = async(req, res)=>{
    const {id} = req.params;
    const asistente = {
        asistentes: req.body.asistentes
    };
    await Actividad.findByIdAndUpdate(id, {$pull: {asistentes: {$in: asistente.asistentes}}}, {new: true});
    res.json({status: 'Participante eliminado'});
}


module.exports = ActividadesController;