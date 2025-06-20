const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const tutorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Tutor must have a first name']
  },
  lastName: {
    type: String,
    required: [true, 'Tutor must have a last name']
  },
  email: {
    type: String,
    required: [true, 'Tutor must have an email'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Tutor must have a phone number']
  },
  password: {
    type: String,
    required: [true, 'Tutor must have a password'],
    minlength: 8,
    select: false
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  status: {
    type: String,
    enum: ['part-time', 'permanent'],
    required: true
  },
  assignedThemes: {
    type: [String],
    default: []
  },
  assignedTeams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    }
  ],
  matricule: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: 'tutor'
  }
});

tutorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

tutorSchema.methods.correctPassword = async function(candidate, real) {
  return await bcrypt.compare(candidate, real);
};

const Tutor = mongoose.model('Tutor', tutorSchema);
module.exports = Tutor;
