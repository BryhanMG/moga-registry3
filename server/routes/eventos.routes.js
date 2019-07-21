const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const url = 'http://localhost:27017/moga';
const evento = require('../controllers/evento.controller')

router.get('/get_all/', evento.getEventos);
router.get('/getcount/', evento.getEventosCount);
router.get('/get/:id', evento.getEvento);
router.get('/getR/:ed', evento.getEventosRevision);
router.get('/get_v/:id/:vo', evento.getVotante);
router.post('/create/', evento.crearEvento);
router.put('/update/:id', evento.updateEvento);
router.put('/add/:id', evento.addVotante);
router.put('/quit/:id', evento.quitVotante);
router.put('/updateEstado/:id/:estado', evento.updateEstado);


//router.put('/update_v/:id', evento.updateVotante);

module.exports = router;