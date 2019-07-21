const Imagen = require('../models/imagen');

const imagenController = {};
//Obtener todas las imagenes
imagenController.getImagenes = async (req, res) => {
    const imagen = await Imagen.find();
    res.json(imagen);
};

//Crear un documento con informacion de la imagen
imagenController.postImagenes = async(req, res)=>{
    const imagen = new Imagen(req.body);
    console.log(imagen);
    await imagen.save();
    res.json({
        'status': 'Image guradada'
    });
};

//Eliminar una imagen
imagenController.deleteImagen = async (req, res) => {
    await Imagen.findByIdAndDelete(req.params.id);
    res.json({status: 'Se eliminó la imagen.'});
};



module.exports = imagenController;