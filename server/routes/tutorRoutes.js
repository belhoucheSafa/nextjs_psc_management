const express = require('express');
const tutorController = require('../controllers/tutorController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protected by admin auth
router.use(authController.protect);

router
  .route('/')
  .get(tutorController.getAllTutors)
  .post(tutorController.createTutor);

router
  .route('/:id')
  .get(tutorController.getTutor)
  .patch(tutorController.updateTutor)
  .delete(tutorController.deleteTutor);

module.exports = router;
