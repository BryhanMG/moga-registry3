const express = require('express');
const router = express.Router();

const usuario = require('../controllers/usuario.controller')

router.get('/get_all/', usuario.getUsuarios);
router.post('/create/', usuario.crearUsuario);
router.get('/get/:id', usuario.getUsuario);
router.put('/update/:id', usuario.editUsuario);
router.delete('/delete/:id', usuario.deleteUsuario);

module.exports = router;