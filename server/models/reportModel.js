// models/reportModel.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },
    type: {
      type: String,
      enum: ['poster', 'article', 'video'],
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    teamStatus: {
      type: String,
      enum: ['unsubmitted', 'submitted'],
      default: 'submitted'
    },
    tutorStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'needs_revision'],
      default: 'pending'
    },
    adminStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // ✅ auto add createdAt and updatedAt
  }
);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
