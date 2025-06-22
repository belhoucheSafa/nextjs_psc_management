const mongoose = require('mongoose');
const Report = require('../models/reportModel');
const Team = require('../models/teamModel');

// 1. Upload Report (Existing)
exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'No file uploaded' });
    }

    const { type, teamId, teamName } = req.body;

    const newReport = await Report.create({
      team: teamId,
      type,
      fileUrl: `/uploads/deliverables/${
        req.file.path.split('uploads/deliverables/')[1]
      }`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      teamStatus: 'submitted',
      tutorStatus: 'pending',
      adminStatus: 'pending'
    });

    res.status(201).json({
      status: 'success',
      data: { report: newReport }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      status: 'success',
      results: reports.length,
      data: { reports }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 3. Get Reports by Team ID
exports.getReportsByTeamId = async (req, res) => {
  try {
    const { teamId } = req.params;

    const latestReports = await Report.aggregate([
      {
        $match: {
          team: new mongoose.Types.ObjectId(teamId),
          teamStatus: 'submitted'
        }
      },
      { $sort: { submittedAt: -1 } },
      {
        $group: {
          _id: '$type',
          doc: { $first: '$$ROOT' } // Get latest per type
        }
      },
      {
        $replaceRoot: { newRoot: '$doc' }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        reports: latestReports
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 4. Update Report Status (Example)
exports.updateReportStatus = async (req, res) => {
  try {
    const updateFields = {};

    if (req.body.tutorStatus !== undefined) {
      updateFields.tutorStatus = req.body.tutorStatus;
    }

    if (req.body.adminStatus !== undefined) {
      updateFields.adminStatus = req.body.adminStatus;
    }

    const report = await Report.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    if (!report) {
      return res.status(404).json({
        status: 'fail',
        message: 'No report found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { report }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 5. Delete Report (Example)
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        status: 'fail',
        message: 'No report found with that ID'
      });
    }

    // Add file system cleanup here if needed
    // fs.unlinkSync(path.join(__dirname, '../public', report.fileUrl));

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getAllLatestReports = async (req, res) => {
  try {
    const teams = await Team.find();
    const reportTypes = ['poster', 'article', 'video'];

    const data = await Promise.all(
      teams.map(async team => {
        const reportsByType = await Promise.all(
          reportTypes.map(async type => {
            const report = await Report.findOne({ team: team._id, type })
              .sort({ createdAt: -1 })
              .lean();
            return report
              ? {
                  id: report._id,
                  type: report.type,
                  fileName: report.fileName,
                  createdAt: report.createdAt,
                  adminStatus: report.adminStatus,
                  fileUrl: report.fileUrl
                }
              : null;
          })
        );

        return {
          teamId: team._id,
          name: team.name,
          theme: team.theme,
          reports: reportsByType.filter(Boolean) // remove nulls (unsubmitted types)
        };
      })
    );

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (err) {
    console.error('❌ Failed to fetch latest reports per team:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching reports'
    });
  }
};

// GET /reports/tutor/:tutorId
exports.getTutorTeamsReports = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;

    const teams = await Team.find({ tutor: tutorId });
    const reportTypes = ['poster', 'article', 'video'];

    const data = await Promise.all(
      teams.map(async team => {
        const reportsByType = await Promise.all(
          reportTypes.map(async type => {
            const report = await Report.findOne({ team: team._id, type })
              .sort({ createdAt: -1 })
              .lean();

            return report
              ? {
                  id: report._id,
                  type: report.type,
                  fileName: report.fileName,
                  createdAt: report.createdAt,
                  tutorStatus: report.tutorStatus,
                  fileUrl: report.fileUrl,
                  adminStatus: report.adminStatus,
                  teamStatus: report.teamStatus
                }
              : null;
          })
        );

        return {
          teamId: team._id,
          name: team.name,
          theme: team.theme,
          reports: reportsByType.filter(Boolean)
        };
      })
    );

    res.status(200).json({ status: 'success', data });
  } catch (err) {
    console.error('❌ Error fetching tutor reports:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
