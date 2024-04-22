const express = require('express');
const {register, login, getInfo, editInfo, logout} = require('../controllers/auth');

const router = express.Router();

const {protect} = require('../middleware/auth');

router.post('/register', register);
router.post('/login',login);
router.get('/info', protect, getInfo);
router.put('/info', protect, editInfo);
router.get('/logout', logout);

module.exports = router;