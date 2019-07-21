const express = require('express');
const router = express.Router();

const login = require('../controllers/login.controller')

router.get('/get/:id', login.getLogin);
router.post('/post/', login.postLogin);
router.delete('/delete/:id', login.deleteLogin);

module.exports = router;