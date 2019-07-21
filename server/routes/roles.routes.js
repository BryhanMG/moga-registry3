const express = require('express');
const router = express.Router();

const rol = require('../controllers/rol.controller')

router.get('/', rol.getRol);

module.exports = router;