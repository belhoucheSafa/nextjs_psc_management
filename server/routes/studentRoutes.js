const express = require('express');

const studentController = require('../controllers/studentController');

const router = express.Router();

router.get('/', studentController.getAllStudents);
router.post('/import', studentController.importStudents);

module.exports = router;
