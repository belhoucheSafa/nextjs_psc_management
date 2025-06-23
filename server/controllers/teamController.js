const catchAsync = require('../utils/catchAsync');
const Team = require('../models/teamModel');
const Student = require('../models/studentModel');
const Tutor = require('../models/tutorModel');
const sendEmail = require('../utils/email');

// Helper
const generate7DigitCode = () =>
  Math.floor(1000000 + Math.random() * 9000000).toString();

// Create a new team

exports.createTeam = catchAsync(async (req, res, next) => {
  const { selectedMembers, selectedTheme, tutorId } = req.body;

  if (
    !selectedTheme ||
    !Array.isArray(selectedMembers) ||
    selectedMembers.length === 0
  ) {
    return res.status(400).json({
      status: 'fail',
      message: 'Theme and members are required'
    });
  }

  const teamCount = await Team.countDocuments();
  const teamName = `Team ${String(teamCount + 1).padStart(2, '0')}`;
  const teamCode = generate7DigitCode();
  const memberIds = selectedMembers.map(m => m._id);

  const initialDeliverables = ['poster', 'article', 'video'].map(type => ({
    type,
    fileUrl: null,
    teamStatus: 'unsubmitted',
    tutorStatus: 'pending',
    adminStatus: 'pending',
    submittedAt: null
  }));

  const newTeam = await Team.create({
    name: teamName,
    theme: selectedTheme,
    members: memberIds,
    tutor: tutorId || null,
    deliverables: initialDeliverables,
    teamCode
  });

  await Student.updateMany(
    { _id: { $in: memberIds } },
    { team: newTeam._id, teamCode }
  );

  await Promise.all(
    selectedMembers.map(async member => {
      const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: "Nunito", Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #89c9ff;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 25px;
              border: 1px solid #e0e0e0;
              border-top: none;
              border-radius: 0 0 5px 5px;
              font-size: 16px;
            }
            .code-container {
              background-color: #f5f7fa;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              text-align: center;
              border-left: 4px solid #89c9ff;
            }
            .team-code {
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 2px;
              color: #2c3e50;
            }
            .footer {
              margin-top: 25px;
              font-size: 12px;
              color: #7f8c8d;
              text-align: center;
              border-top: 1px solid #eee;
              padding-top: 15px;
            }
            .highlight {
              color: #fda943;
              font-weight: 700;
            }
            .header-title {
              font-weight: 800;
              font-size: 20px;
            }
            .theme-name {
              margin-left: 5px;
            }
            .warning {
              font-size: 14px;
              color: #f56c6c;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-title">Team Space Access Code</div>
          </div>
          <div class="content">
            <p>👋🏻 Hello <span class="highlight">${member.firstName}</span> ,</p>

            <p>
              You have been added to <span class="highlight">${teamName}</span> under the
              theme :
              <span class="theme-name"><strong>« ${selectedTheme} »</strong></span>
            </p>

            <div class="code-container">
              <p>Your team access code is :</p>
              <div class="team-code">${teamCode}</div>
              <p>Use this code to access your team workspace.</p>
            </div>

            <p class="warning">
              📛 Please keep this code secure and don't share it with anyone outside
              your team !
            </p>

            <div class="footer">
              <p>
                This is an automated message from Polytechnicien Team Management
                System
              </p>
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
        email: member.email,
        subject: `Team Space Access Code - ${teamName}`,
        message: htmlTemplate
      });
    })
  );

  res.status(201).json({
    status: 'success',
    data: {
      team: newTeam,
      code: teamCode
    }
  });
});

// Get all teams with full details
exports.getAllTeams = catchAsync(async (req, res, next) => {
  const teams = await Team.find()
    .populate('tutor', 'firstName lastName email')
    .populate('members', 'firstName lastName email')
    .lean();

  res.status(200).json({
    status: 'success',
    results: teams.length,
    data: {
      teams
    }
  });
});

// Get a single team by ID
exports.getTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id)
    .populate('tutor', 'firstName lastName email')
    .populate('members', 'firstName lastName email');

  if (!team) {
    return res.status(404).json({
      status: 'fail',
      message: 'Team not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      team
    }
  });
});

// Update a team
exports.updateTeam = catchAsync(async (req, res, next) => {
  const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .populate('tutor', 'firstName lastName email')
    .populate('members', 'firstName lastName email');

  if (!updatedTeam) {
    return res.status(404).json({
      status: 'fail',
      message: 'No team found with that ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      team: updatedTeam
    }
  });
});

// Delete a team
exports.deleteTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findByIdAndDelete(req.params.id);

  if (!team) {
    return res.status(404).json({
      status: 'fail',
      message: 'No team found to delete'
    });
  }

  // Optional: Remove team from students
  await Student.updateMany({ team: team._id }, { team: null, teamCode: null });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.assignTutorToTeam = catchAsync(async (req, res, next) => {
  const { tutorId } = req.body;
  const teamId = req.params.id;

  const tutor = await Tutor.findById(tutorId);
  if (!tutor || !tutor.active) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tutor not found or inactive'
    });
  }

  const team = await Team.findByIdAndUpdate(
    teamId,
    { tutor: tutorId },
    { new: true }
  );

  if (!team) {
    return res.status(404).json({
      status: 'fail',
      message: 'Team not found'
    });
  }

  // Add team to tutor's assignedTeams list if not already present
  if (!tutor.assignedTeams.includes(teamId)) {
    tutor.assignedTeams.push(teamId);
    await tutor.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      team
    }
  });
});
