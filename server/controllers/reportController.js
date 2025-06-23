const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const libre = require('libreoffice-convert'); // ✅ required!
const { PDFDocument, rgb } = require('pdf-lib');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const convert = require('docx-pdf');

const Team = require('../models/teamModel');
const Report = require('../models/reportModel');

// 1. Upload Report (Modified for docx-pdf)
exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'No file uploaded' });
    }

    const { type, teamId, teamName } = req.body;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `${type}_${teamName}${ext}`;

    // Save original file
    const newReport = await Report.create({
      team: teamId,
      type,
      fileUrl: `/uploads/deliverables/${
        req.file.path.split('uploads/deliverables/')[1]
      }`,
      fileName: filename,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      teamStatus: 'submitted',
      tutorStatus: 'pending',
      adminStatus: 'pending'
    });

    // ✅ Convert to PDF if it's an article
    if (type === 'article') {
      const sourcePath = req.file.path;
      const pdfFolder = path.join(
        'public',
        'uploads',
        'deliverables',
        'PDF_Articles'
      );

      // Ensure PDF directory exists
      if (!fs.existsSync(pdfFolder)) {
        fs.mkdirSync(pdfFolder, { recursive: true });
      }

      const pdfFilename = `${type}_${teamName}.pdf`;
      const pdfPath = path.join(pdfFolder, pdfFilename);
      const pdfPublicUrl = `/uploads/deliverables/PDF_Articles/${pdfFilename}`;

      // Convert using docx-pdf
      convert(sourcePath, pdfPath, async (err, result) => {
        if (err) {
          console.error('❌ PDF conversion error:', err);
          // Still return success, just warn
          return res.status(201).json({
            status: 'success',
            warning: 'Report saved but PDF conversion failed',
            data: { report: newReport }
          });
        }

        console.log('✅ PDF version saved:', pdfPath);

        // Optionally update the report with PDF URL
        // await Report.findByIdAndUpdate(newReport._id, { pdfUrl: pdfPublicUrl });

        return res.status(201).json({
          status: 'success',
          data: { report: newReport },
          pdfFile: pdfPublicUrl
        });
      });
    } else {
      // For non-articles, return directly
      return res.status(201).json({
        status: 'success',
        data: { report: newReport }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 2. Get All Reports
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

exports.generateCombinedCatalogue = async (req, res) => {
  try {
    const { default: PDFMerger } = await import('pdf-merger-js');
    const merger = new PDFMerger();

    // Paths to directories
    const postersDir = path.join(
      __dirname,
      '../public/uploads/deliverables/Posters'
    );
    const articlesDir = path.join(
      __dirname,
      '../public/uploads/deliverables/PDF_Articles'
    );
    const tempDir = path.join(__dirname, '../temp');

    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Get all teams from database and create a map
    const teams = await Team.find().select('_id name');
    const teamMap = new Map(
      teams.map(team => [team._id.toString(), team.name])
    );

    // Process each team
    for (const [teamId, teamName] of teamMap) {
      const teamIdentifier = teamName.replace(/\s+/g, '_');

      // Find article and poster files for this team
      const articleFile = fs
        .readdirSync(articlesDir)
        .find(
          file =>
            file
              .toLowerCase()
              .includes(`article_${teamIdentifier.toLowerCase()}`) &&
            file.endsWith('.pdf')
        );

      const posterFile = fs
        .readdirSync(postersDir)
        .find(
          file =>
            file
              .toLowerCase()
              .includes(`poster_${teamIdentifier.toLowerCase()}`) &&
            file.endsWith('.pdf')
        );

      // Process article
      if (articleFile) {
        const articlePath = path.join(articlesDir, articleFile);
        await merger.add(articlePath);
      } else {
        // Create placeholder page for missing article
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        page.drawText(`Article: ${teamName} (Not Submitted)`, {
          x: 50,
          y: 750,
          size: 20,
          color: rgb(0.8, 0, 0) // Red color for missing content
        });
        const pdfBytes = await pdfDoc.save();
        const tempPath = path.join(
          tempDir,
          `article_placeholder_${teamIdentifier}.pdf`
        );
        await writeFile(tempPath, pdfBytes);
        await merger.add(tempPath);
        await unlink(tempPath);
      }

      // Process poster
      if (posterFile) {
        const posterPath = path.join(postersDir, posterFile);
        await merger.add(posterPath);
      } else {
        // Create placeholder page for missing poster
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        page.drawText(`Poster: ${teamName} (Not Submitted)`, {
          x: 50,
          y: 750,
          size: 20,
          color: rgb(0.8, 0, 0) // Red color for missing content
        });
        const pdfBytes = await pdfDoc.save();
        const tempPath = path.join(
          tempDir,
          `poster_placeholder_${teamIdentifier}.pdf`
        );
        await writeFile(tempPath, pdfBytes);
        await merger.add(tempPath);
        await unlink(tempPath);
      }
    }

    // Generate table of contents - now passing the teams data
    await addTableOfContents(merger, teams);

    const mergedPdf = await merger.saveAsBuffer();

    // Clean up
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Combined_Teams_Catalogue.pdf'
    );
    res.send(mergedPdf);
  } catch (error) {
    console.error('Error generating combined catalogue:', error);
    res.status(500).json({
      message: 'Error generating combined catalogue',
      error: error.message
    });
  }
};

// Updated helper function for table of contents

async function addTableOfContents(merger, teams) {
  try {
    const { default: PDFMerger } = await import('pdf-merger-js');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    // Add title
    page.drawText('Table of Contents', {
      x: 50,
      y: 750,
      size: 24,
      color: rgb(0, 0, 0.8)
    });

    // Add team listings
    let yPosition = 700;
    teams.forEach((team, index) => {
      page.drawText(`${index + 1}. ${team.name}`, {
        x: 50,
        y: yPosition,
        size: 12
      });
      yPosition -= 20;

      // Add page numbers for article and poster
      page.drawText(`Article: page ${index * 2 + 2}`, {
        x: 200,
        y: yPosition,
        size: 10,
        color: rgb(0.5, 0.5, 0.5)
      });
      page.drawText(`Poster: page ${index * 2 + 3}`, {
        x: 300,
        y: yPosition,
        size: 10,
        color: rgb(0.5, 0.5, 0.5)
      });
      yPosition -= 30;
    });

    const pdfBytes = await pdfDoc.save();
    const tempPath = path.join(__dirname, '../temp/toc.pdf');
    await writeFile(tempPath, pdfBytes);

    // Save current merger state
    const currentPdf = await merger.saveAsBuffer();

    // Create new merger and add TOC first
    const newMerger = new PDFMerger();
    await newMerger.add(tempPath);
    await newMerger.add(currentPdf);

    // Replace the merger's contents
    merger.reset(); // Clear existing content
    const newPdf = await newMerger.saveAsBuffer();
    await merger.add(newPdf);

    await unlink(tempPath);
  } catch (err) {
    console.error('Error generating table of contents:', err);
    // Skip TOC if there's an error
  }
}
