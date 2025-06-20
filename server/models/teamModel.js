// const mongoose = require('mongoose');

// const deliverableSchema = new mongoose.Schema(
//   {
//     type: {
//       type: String,
//       enum: ['poster', 'article', 'video'],
//       required: true
//     },
//     fileUrl: {
//       type: String,
//       default: null
//     },
//     teamStatus: {
//       type: String,
//       enum: ['unsubmitted', 'submitted'],
//       default: 'unsubmitted'
//     },
//     tutorStatus: {
//       type: String,
//       enum: ['pending', 'approved', 'rejected'],
//       default: 'pending'
//     },
//     adminStatus: {
//       type: String,
//       enum: ['pending', 'approved', 'rejected'],
//       default: 'pending'
//     },
//     submittedAt: {
//       type: Date,
//       default: null
//     }
//   },
//   { timestamps: true }
// );

// const teamSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Team must have a name']
//     },
//     theme: {
//       type: String,
//       required: [true, 'Team must have a theme']
//     },
//     members: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Student'
//       }
//     ],
//     tutor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Tutor',
//       required: false
//     },
//     deliverables: {
//       type: [deliverableSchema],
//       default: [{ type: 'poster' }, { type: 'article' }, { type: 'video' }]
//     },
//     teamCode: {
//       type: String,
//       required: true,
//       unique: true
//     }
//   },
//   { timestamps: true }
// );

// const Team = mongoose.model('Team', teamSchema);
// module.exports = Team;

const mongoose = require('mongoose');
const validator = require('validator');

const deliverableSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['poster', 'article', 'video'],
      required: [true, 'Deliverable must have a type']
    },
    fileUrl: {
      type: String,
      default: null,
      validate: {
        validator: function(v) {
          // Only validate if fileUrl exists
          return (
            v === null ||
            validator.isURL(v, {
              protocols: ['http', 'https'],
              require_protocol: true
            })
          );
        },
        message: 'Invalid file URL'
      }
    },
    fileName: {
      type: String,
      default: null,
      maxlength: [255, 'File name cannot exceed 255 characters']
    },
    fileSize: {
      type: Number,
      default: null,
      min: [1, 'File size must be at least 1 byte']
    },
    fileType: {
      type: String,
      default: null,
      maxlength: [100, 'File type cannot exceed 100 characters']
    },
    teamStatus: {
      type: String,
      enum: ['unsubmitted', 'submitted'],
      default: 'unsubmitted'
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
    feedback: {
      type: String,
      default: null,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters']
    },
    submittedAt: {
      type: Date,
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'deliverables.lastUpdatedByModel'
    },
    lastUpdatedByModel: {
      type: String,
      enum: ['Student', 'Tutor', 'Admin']
    },
    version: {
      type: Number,
      default: 1,
      min: [1, 'Version must be at least 1']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster querying
deliverableSchema.index({ type: 1 });
deliverableSchema.index({ teamStatus: 1 });
deliverableSchema.index({ tutorStatus: 1 });
deliverableSchema.index({ adminStatus: 1 });

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team must have a name'],
      trim: true,
      maxlength: [100, 'Team name cannot exceed 100 characters'],
      minlength: [3, 'Team name must be at least 3 characters']
    },
    theme: {
      type: String,
      required: [true, 'Team must have a theme'],
      trim: true,
      maxlength: [255, 'Theme cannot exceed 255 characters']
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        validate: {
          validator: function(v) {
            // Ensure no duplicate members
            return this.members.filter(m => m.equals(v)).length <= 1;
          },
          message: 'Duplicate team member detected'
        }
      }
    ],
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tutor',
      default: null
    },
    deliverables: {
      type: [deliverableSchema],
      default: () => [
        { type: 'poster' },
        { type: 'article' },
        { type: 'video' }
      ],
      validate: {
        validator: function(v) {
          // Ensure only one deliverable of each type exists
          const types = v.map(d => d.type);
          return new Set(types).size === types.length;
        },
        message: 'Duplicate deliverable type detected'
      }
    },
    teamCode: {
      type: String,
      required: [true, 'Team must have a code'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [6, 'Team code must be at least 6 characters'],
      maxlength: [12, 'Team code cannot exceed 12 characters']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better performance
teamSchema.index({ name: 1 });
teamSchema.index({ teamCode: 1 });
teamSchema.index({ tutor: 1 });
teamSchema.index({ 'deliverables.type': 1 });
teamSchema.index({ 'deliverables.tutorStatus': 1 });
teamSchema.index({ 'deliverables.adminStatus': 1 });

// Virtual for member count
teamSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for completed deliverables count
teamSchema.virtual('completedDeliverables').get(function() {
  return this.deliverables.filter(d => d.teamStatus === 'submitted').length;
});

// Pre-save hook to ensure deliverables array is valid
teamSchema.pre('save', function(next) {
  if (this.isModified('deliverables')) {
    const types = this.deliverables.map(d => d.type);
    if (new Set(types).size !== types.length) {
      throw new Error('Duplicate deliverable types are not allowed');
    }
  }
  next();
});

// Static method to find teams by deliverable status
teamSchema.statics.findByDeliverableStatus = function(statusType, statusValue) {
  const query = {};
  query[`deliverables.${statusType}`] = statusValue;
  return this.find(query).populate('members tutor');
};

// Method to update a deliverable
teamSchema.methods.updateDeliverable = async function(
  deliverableType,
  updates,
  userId,
  userModel
) {
  const deliverable = this.deliverables.find(d => d.type === deliverableType);

  if (!deliverable) {
    throw new Error(`Deliverable of type ${deliverableType} not found`);
  }

  // Apply updates
  Object.assign(deliverable, updates);

  // Track who made the change
  deliverable.lastUpdatedBy = userId;
  deliverable.lastUpdatedByModel = userModel;

  // Update timestamps based on operation
  if (updates.teamStatus === 'submitted') {
    deliverable.submittedAt = new Date();
  }
  if (updates.tutorStatus && updates.tutorStatus !== 'pending') {
    deliverable.reviewedAt = new Date();
  }

  // Increment version if file is being updated
  if (updates.fileUrl) {
    deliverable.version += 1;
  }

  return this.save();
};

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
