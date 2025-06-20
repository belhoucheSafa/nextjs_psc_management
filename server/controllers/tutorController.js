const crypto = require('crypto');
const sendEmail = require('../utils/email');
const Tutor = require('../models/tutorModel');
const Team = require('../models/teamModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all tutors
exports.getAllTutors = catchAsync(async (req, res) => {
  const tutors = await Tutor.find({ isDeleted: false }).populate(
    'assignedTeams'
  );

  res.status(200).json({
    status: 'success',
    results: tutors.length,
    data: { tutors }
  });
});

// Get one tutor
exports.getTutor = catchAsync(async (req, res, next) => {
  const tutor = await Tutor.findById(req.params.id).populate('assignedTeams');
  if (!tutor) return next(new AppError('Tutor not found', 404));

  res.status(200).json({
    status: 'success',
    data: { tutor }
  });
});

// Create new tutor
exports.createTutor = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    gender,
    status,
    assignedThemes = [],
    assignedTeams = [],
    matricule = ''
  } = req.body;

  const exists = await Tutor.findOne({ email });
  if (exists) return next(new AppError('Email already exists', 400));

  const randomPassword = crypto.randomBytes(5).toString('hex');

  const newTutor = await Tutor.create({
    firstName,
    lastName,
    email,
    phone,
    gender,
    status,
    assignedThemes,
    assignedTeams,
    matricule,
    password: randomPassword
  });

  // Assign tutor to teams if assignedTeams is not empty
  if (assignedTeams.length > 0) {
    await Team.updateMany(
      { _id: { $in: assignedTeams } },
      { tutor: newTutor._id }
    );
  }

  // try {
  //   await sendEmail({
  //     email: newTutor.email,
  //     subject: '🎓 Your Tutor Account Credentials',
  //     message: `Hi ${firstName} ${lastName},\n\nYou have been added as a PSC tutor.\n\nYour login credentials:\nEmail: ${email}\nPassword: ${randomPassword}\n\nLogin here: https://your-frontend-link.com/login`
  //   });

  //   res.status(201).json({
  //     status: 'success',
  //     data: { tutor: newTutor }
  //   });
  // } catch (err) {
  //   await Tutor.findByIdAndDelete(newTutor._id);
  //   return next(
  //     new AppError('Failed to send email. Tutor was not created.', 500)
  //   );
  // }
  try {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #89c9ff;
          color: white;
          padding: 8px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .credentials {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
          font-weight:600;
        }
        .login-btn {
          display: inline-block;
          background-color: #89c9ff;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 15px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #777;
          text-align: center;
        }
        a{
        text-decoration : none ;
        color : #fff
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h3>Your Tutor Account Credentials</h3>
      </div>
      <div class="content">
        <p>Hi ${firstName} ${lastName},</p>
        
        <p>🚀 You have been added as a PSC tutor !</p>
        
        <div class="credentials">
          <p><strong>Your login credentials :</strong></p>
          <p>Email : ${email}</p>
          <p>Password : ${randomPassword}</p>
        </div>
        
        <a href="http://localhost:5173/login" class="login-btn">Login Here</a>
        
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>
      </div>
    </body>
    </html>
    `;

    await sendEmail({
      email: newTutor.email,
      subject: '🎓 Your Tutor Account Credentials',
      message: htmlTemplate
    });

    res.status(201).json({
      status: 'success',
      data: { tutor: newTutor }
    });
  } catch (err) {
    await Tutor.findByIdAndDelete(newTutor._id);
    return next(
      new AppError('Failed to send email. Tutor was not created.', 500)
    );
  }
});

// Update tutor
exports.updateTutor = catchAsync(async (req, res, next) => {
  const { assignedTeams = [] } = req.body;

  const tutor = await Tutor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tutor) return next(new AppError('Tutor not found', 404));

  if (assignedTeams.length > 0) {
    // 1. Remove tutor from teams that are no longer assigned
    await Team.updateMany(
      { tutor: tutor._id, _id: { $nin: assignedTeams } },
      { $unset: { tutor: '' } }
    );

    // 2. Assign tutor to newly assigned teams
    await Team.updateMany(
      { _id: { $in: assignedTeams } },
      { tutor: tutor._id }
    );
  } else {
    // If no assignedTeams, remove tutor from all teams
    await Team.updateMany({ tutor: tutor._id }, { $unset: { tutor: '' } });
  }

  res.status(200).json({
    status: 'success',
    data: { tutor }
  });
});

// Delete tutor
exports.deleteTutor = catchAsync(async (req, res, next) => {
  const tutor = await Tutor.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, active: false },
    { new: true }
  );

  if (!tutor) {
    return next(new AppError('Tutor not found', 404));
  }

  // Unset the tutor in all teams that had this tutor
  await Team.updateMany({ tutor: tutor._id }, { $unset: { tutor: '' } });

  res.status(200).json({
    status: 'success',
    message: 'Tutor soft-deleted and removed from teams',
    data: { tutor }
  });
});
