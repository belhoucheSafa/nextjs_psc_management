// // routes/reportRoutes.js
// const express = require('express');
// const upload = require('../utils/multer');
// const { uploadReport } = require('../controllers/reportController');

// const router = express.Router();

// router.post('/upload', upload.single('report'), uploadReport);

// module.exports = router;

const express = require('express');
const upload = require('../utils/multer');
const {
  uploadReport,
  getAllReports,
  getReportsByTeamId,
  updateReportStatus,
  deleteReport,
  getAllLatestReports,
  getTutorTeamsReports
} = require('../controllers/reportController');

const router = express.Router();

router.post('/upload', upload.single('report'), uploadReport);
router.get('/', getAllReports);
router.get('/all-latest', getAllLatestReports);
router.get('/team/:teamId', getReportsByTeamId);
router.get('/tutor/:tutorId', getTutorTeamsReports);

router.patch('/:id', updateReportStatus);
router.delete('/:id', deleteReport);

module.exports = router;
