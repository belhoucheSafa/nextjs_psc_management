const express = require('express');

const router = express.Router({ mergeParams: true });
const deliverableController = require('../controllers/deliverableController');
const authController = require('../controllers/authController');

// Protect all routes after this middleware
// router.use(authController.protect);

// Student routes
router.post(
  '/submit',
  //   authController.restrictTo('student'),
  deliverableController.uploadDeliverableFile,
  deliverableController.submitDeliverable
);

router.get(
  '/',
  //   authController.restrictTo('student', 'tutor', 'admin'),
  deliverableController.getTeamDeliverables
);

// Tutor routes
router.patch(
  '/:deliverableType/status',
  //   authController.restrictTo('tutor', 'admin'),
  deliverableController.updateDeliverableStatus
);

// Admin routes can be added here...

module.exports = router;
