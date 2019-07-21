const express = require('express');
const router = express.Router();

const Maquina = require('../controllers/maquina.controller')

router.get('/getAll/:id', Maquina.getMaquinas);
router.post('/crearMaquina/', Maquina.crearMaquina);
router.get('/login/:id', Maquina.getMaquinaLogin);
router.put('/update/:id', Maquina.updateMaquina);
router.delete('/delete/:id', Maquina.deleteMaquina);

module.exports = router;