const express = require('express');
const router = express.Router();

const Actividades = require('../controllers/actividad.controller')

router.get('/get_all/', Actividades.getActividades);
router.get('/get/:id', Actividades.getActividad);
router.get('/getall-P/:id', Actividades.getAllAsistentes);
router.post('/create/', Actividades.crearActividad);
router.get('/getall/:id', Actividades.getAllActividadesEditar);
router.put('/update/:id', Actividades.updateActividad);
router.delete('/delete/:id', Actividades.deleteActividad);
router.put('/add/:id', Actividades.addAsistente);
router.put('/quit/:id', Actividades.quitAsistente);

module.exports = router;