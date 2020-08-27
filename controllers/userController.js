const multer = require('multer');
const sharp = require('sharp');

const User = require('../Model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload only images!', 400), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // Check if there is password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not password update. Please go to /updatePassword',
        400
      )
    );
  }
  // 2) Filter the object, only name and email
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  // 3)Find the user by id and update
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  console.log(updatedUser);
  res.status(200).json({
    status: 'success',
    data: {
      users: updatedUser,
    },
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// Do not update password
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
