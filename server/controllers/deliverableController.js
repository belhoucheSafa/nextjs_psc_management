const multer = require('multer');
const fs = require('fs');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Team = require('../models/teamModel');

// Configure Multer for file uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type; // 'poster', 'video', 'article'
    const typeMap = {
      poster: 'Posters',
      article: 'Articles',
      video: 'Videos'
    };

    const folder = typeMap[type] || 'Others';
    const path = `public/uploads/deliverables/${folder}`;

    // Ensure folder exists

    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

    cb(null, path);
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname); // Trust frontend-provided name
  }
});

const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    // Validate file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4'
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new AppError(
          'Invalid file type. Only PDF, DOCX, and MP4 files are allowed',
          400
        ),
        false
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

exports.uploadDeliverableFile = upload.single('report');

exports.submitDeliverable = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded', 400));

  const team = await Team.findById(req.params.teamId);
  if (!team) return next(new AppError('Team not found', 404));

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/deliverables/${
    req.file.filename
  }`;

  const updates = {
    fileUrl,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    fileType: req.file.mimetype,
    teamStatus: 'submitted'
  };

  await team.updateDeliverable(
    req.body.type,
    updates,
    null, // or 'devUser'
    null // or null
  );

  res.status(200).json({
    status: 'success',
    message: 'Deliverable submitted successfully'
  });
});

exports.getTeamDeliverables = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.teamId).select('deliverables');

  if (!team) return next(new AppError('Team not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      deliverables: team.deliverables
    }
  });
});

exports.updateDeliverableStatus = catchAsync(async (req, res, next) => {
  const { statusType, statusValue } = req.body;

  const validStatusTypes = ['tutorStatus', 'adminStatus'];

  if (!validStatusTypes.includes(statusType)) {
    return next(new AppError('Invalid status type', 400));
  }

  const team = await Team.findById(req.params.teamId);
  if (!team) return next(new AppError('Team not found', 404));

  const updates = {
    [statusType]: statusValue,
    feedback: req.body.feedback || null
  };

  await team.updateDeliverable(
    req.params.deliverableType,
    updates,
    req.user.id,
    req.user.role
  );

  res.status(200).json({
    status: 'success',
    message: 'Deliverable status updated'
  });
});

// Add more deliverable-related controller methods as needed...
