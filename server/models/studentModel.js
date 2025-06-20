const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
  phone: String,
  speciality: String,
  gender: String,
  email: String,
  teamCode: String,
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  }
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
