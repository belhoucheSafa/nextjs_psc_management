const Student = require('../models/studentModel');
const catchAsync = require('../utils/catchAsync');

exports.importStudents = catchAsync(async (req, res, next) => {
  const students = req.body.students;

  console.log('📛 students :', students);
  // ✅ Sanity check
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'No student data provided'
    });
  }

  // 🧹 Optional: Clear existing data
  await Student.deleteMany();

  // 💾 Save students
  const createdStudents = await Student.insertMany(students);

  res.status(201).json({
    status: 'success',
    results: createdStudents.length,
    data: {
      students: createdStudents
    }
  });
});

exports.getAllStudents = catchAsync(async (req, res, next) => {
  const students = await Student.find().populate('team');

  res.status(200).json({
    status: 'success',
    results: students.length,
    data: { students }
  });
});
