const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Admin must have a name']
  },
  email: {
    type: String,
    required: [true, 'Admin must have an email'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Admin must have a password'],
    minlength: 8,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: 'admin'
  }
});

// Encrypt password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Check password
adminSchema.methods.correctPassword = async function(candidate, real) {
  return await bcrypt.compare(candidate, real);
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
