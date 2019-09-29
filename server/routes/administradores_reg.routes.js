const express = require('express');
const router = express.Router();

const admin_reg = require('../controllers/administrador_reg.controller')

router.get('/get_all/', admin_reg.getAdminRegs);
router.get('/get/:id', admin_reg.getAdminRegPass);
router.get('/get_evt/:id', admin_reg.getAdminEventos);
router.get('/get/:id/:pass', admin_reg.getAdminRegLogin);
router.get('/getAE/', admin_reg.getAdminsEventos);
router.post('/create/', admin_reg.crearAdminReg);
router.put('/update/:id', admin_reg.updateAdminPassReg);
router.put('/updateEventos/:id', admin_reg.updateAdminEventos);
router.delete('/delete/:id', admin_reg.deleteAdminReg);

module.exports = router;