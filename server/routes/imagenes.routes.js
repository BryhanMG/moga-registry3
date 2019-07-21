const express = require('express');
const router = express.Router();

const imagen = require('../controllers/imagen.controller')

router.get('/get/', imagen.getImagenes);
router.post('/post/', imagen.postImagenes);
router.delete('/delete/:id', imagen.postImagenes);

module.exports = router;