const express = require('express');
const {register, login, getInfo, editInfo, logout, deleteAccount} = require('../controllers/auth');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

router.post('/register', register);
router.post('/login',login);
router.get('/info', protect, getInfo).put('/info', protect, authorize('user', 'admin'), editInfo);
router.get('/logout', logout);
router.delete('/delete', protect, authorize('user', 'admin'), deleteAccount)

module.exports = router;