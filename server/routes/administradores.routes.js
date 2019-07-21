const express = require('express');
const router = express.Router();

const admin = require('../controllers/administrador.controller')

router.get('/get_all/', admin.getAdmins);
router.get('/get/:id', admin.getAdminPass);
router.get('/get_pass/:id/:pass', admin.getAdminLogin);
router.get('/get_evt/:id', admin.getAdminEventos);
router.post('/create/', admin.crearAdmin);
router.get('/getAE/', admin.getAdminsEventos);
router.put('/addEvento/:id', admin.addAdminEvento);
router.put('/updateEventos/:id', admin.updateAdminEventos);
router.put('/updatePass/:id', admin.updateAdminPass);
router.delete('/delete/:id', admin.deleteAdmin);

module.exports = router;