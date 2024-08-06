const express = require('express');
const router = express.Router();
const { viewProfile, updateProfile } = require('../controllers/profileController');
const auth = require('../middlewares/auth');

// Get profile
router.get('/', auth, viewProfile);

// Update profile
router.put('/', auth, updateProfile);

module.exports = router;
