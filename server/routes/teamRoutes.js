const express = require('express');
const teamController = require('../controllers/teamController');
const authController = require('../controllers/authController');
const deliverableRouter = require('./deliverableRoutes');

const router = express.Router();

// Protect all routes
// router.use(authController.protect);

// router.use('/:teamId/deliverables', deliverableRouter);
// CRUD
router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeam);
router.post('/', teamController.createTeam);
router.patch('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);
router.patch('/:id/assign-tutor', teamController.assignTutorToTeam);

module.exports = router;
