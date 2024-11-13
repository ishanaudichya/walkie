const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const hashPassword = require('../middleware/passwordHash');

// Register route
router.post('/register',
  hashPassword,
  authController.register
);

// Login route
router.post('/login', authController.login);

module.exports = router; 