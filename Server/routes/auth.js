const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/register', authController.register);
router.post('/register-admin', auth, admin, authController.registerAdmin);
router.post('/login', authController.login);
router.get('/verify', authController.verifyToken);
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;