const Admin = require('../models/adminModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// 🔍 Get all admins (useful if you want to see list, even if just one now)
exports.getAllAdmins = catchAsync(async (req, res) => {
  const admins = await Admin.find();
  res.status(200).json({
    status: 'success',
    results: admins.length,
    data: {
      admins
    }
  });
});

// 🔍 Get single admin by ID
exports.getAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) return next(new AppError('Admin not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      admin
    }
  });
});

// ✏️ Update admin info (name or email)
exports.updateAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!admin) return next(new AppError('Admin not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      admin
    }
  });
});

// ❌ Delete admin
exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findByIdAndDelete(req.params.id);

  if (!admin) return next(new AppError('Admin not found', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});
