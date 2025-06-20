const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/admin-signup', authController.signupAdmin); // One-time use
router.post('/admin-login', authController.loginAdmin);
router.post('/tutor-login', authController.loginTutor);
router.post('/student-login', authController.loginStudent);

module.exports = router;
