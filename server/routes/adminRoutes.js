const express = require('express');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all admin routes
router.use(authController.protect);

router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdmin);
router.patch('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
