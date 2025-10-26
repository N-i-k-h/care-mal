const express = require('express');
const router = express.Router();
const { registerUser, registerDoctor, login } = require('../controllers/authController');

// User routes
router.post('/user/register', registerUser);
router.post('/user/login', (req, res) => login(req, res, false));

// Doctor routes
router.post('/doctor/register', registerDoctor);
router.post('/doctor/login', (req, res) => login(req, res, true));

module.exports = router;