const mongoose = require('mongoose');
const validator = require('validator');



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


// Virtual for member count
teamSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
