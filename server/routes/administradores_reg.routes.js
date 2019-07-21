const express = require('express');
const router = express.Router();

const admin_reg = require('../controllers/administrador_reg.controller')

router.get('/get_all/', admin_reg.getAdminRegs);
router.get('/get/:id', admin_reg.getAdminRegPass);
router.get('/get/:id/:pass', admin_reg.getAdminRegLogin);
router.post('/create/', admin_reg.crearAdminReg);
router.put('/update/:id', admin_reg.updateAdminReg);
router.delete('/delete/:id', admin_reg.deleteAdminReg);

module.exports = router;