const express = require('express');
const router = express.Router();

const Candidato = require('../controllers/candidato.controller')

router.get('/get_all_c/', Candidato.getCandidatos);
router.get('/get_all/:id', Candidato.getAllCandidato);
router.get('/get/:id', Candidato.getCandidato);
router.post('/create/', Candidato.crearCandidato);
router.put('/update/:id', Candidato.updateCandidato);
router.put('/add/:id', Candidato.addCandidato);
router.put('/quit/:id', Candidato.quitCandidato);
router.delete('/delete/:id', Candidato.deleteCandidatoRol);

module.exports = router;