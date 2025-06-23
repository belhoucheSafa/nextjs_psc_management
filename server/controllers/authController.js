const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Admin = require('../models/adminModel');
const Tutor = require('../models/tutorModel');
const Team = require('../models/teamModel');
const Student = require('../models/studentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// 🔐 Sign Token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// 🌍 Send Token Response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// ✅ Admin Login
exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check email and password
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2. Find admin
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3. Send token
  createSendToken(admin, 200, res);
});

// ✅ Admin Signup (One-time)
exports.signupAdmin = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email and password!', 400));
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return next(new AppError('Admin already exists with this email', 400));
  }

  const newAdmin = await Admin.create({
    name,
    email,
    password
  });

  createSendToken(newAdmin, 201, res);
});

// ✅ Tutor Login
exports.loginTutor = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const tutor = await Tutor.findOne({ email }).select('+password');
  if (!tutor || !(await tutor.correctPassword(password, tutor.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(tutor, 200, res);
});

// ✅ Student Login (by teamCode)

exports.loginStudent = catchAsync(async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return next(new AppError('Please provide your 7-digit team code!', 400));
  }

  // 🧠 Match the team by teamCode
  const team = await Team.findOne({ teamCode: code })
    .populate('tutor')
    .populate('members');

  if (!team) {
    return next(new AppError('Invalid team code', 401));
  }

  // ✅ Send token based on team (not individual student)
  const token = jwt.sign({ teamId: team._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({
    status: 'success',
    token,
    data: {
      team
    }
  });
});

// Protect Middleware
// Protect Middleware (Support team tokens too)
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // For students logging in with teamCode
  const team = await Team.findById(decoded.teamId);
  if (team) {
    req.team = team;
    return next();
  }

  // For admin or tutor
  const user =
    (await Admin.findById(decoded.id)) || (await Tutor.findById(decoded.id));

  if (!user) {
    return next(new AppError('User no longer exists.', 401));
  }

  req.user = user;
  next();
});

exports.createTestAdmin = async (req, res) => {
  try {
    const admin = await Admin.create({
      name: 'Mahmoud Menyaoui',
      email: 'admin@psc.tn',
      password: '@pscApp025!'
    });

    res.status(201).json({
      status: 'success',
      data: admin
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};
