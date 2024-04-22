const express = require('express');
const {register, login, logout} = require('../controllers/auth');

const router = express.Router();

const {protect} = require('../middleware/auth');

router.post('/register', register);
router.post('/login',login);
router.get('/me', protect, getMe);
router.put('/edit', );
router.get('/logout', logout);

module.exports = router;