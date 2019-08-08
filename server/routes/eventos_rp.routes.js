const express = require('express');
const router = express.Router();

const EventoR = require('../controllers/evento_rp.controller')

router.get('/get_all/', EventoR.getEventoRs);
router.get('/getcount/', EventoR.getEventosCount);
router.get('/get/:id', EventoR.getEventoR);
router.post('/create/', EventoR.crearEventoR);
router.put('/update/:id', EventoR.updateEvento);
router.get('/get_p/:id/:pa', EventoR.getParticipante);
router.get('/get_bo/:id/:bo', EventoR.getParticipanteBoleta);
router.put('/add/:id', EventoR.addParticipante);
router.put('/quit/:id', EventoR.quitParticipante);
router.put('/estado/:id', EventoR.updateEstado);
router.put('/terminar/:id', EventoR.updateTerminar);

module.exports = router;