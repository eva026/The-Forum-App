const multer = require('multer');
const sharp = require('sharp');
const Post = require('../Model/postModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllPosts = factory.getAll(Post);
exports.getPost = factory.getOne(Post, { path: 'comments' });
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);

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

exports.uploadPostImage = upload.single('image');

exports.setPostImage = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `post-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/posts/${req.file.filename}`);

  next();
};

exports.createPost = catchAsync(async (req, res, next) => {
  // Set user id
  if (!req.body.user) req.body.user = req.user.id;

  // Set post image
  if (req.file) req.body.image = req.file.filename;

  console.log(req.body);
  //  Create Post
  const newPost = await Post.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newPost,
    },
  });
});

exports.updateVote = catchAsync(async (req, res, next) => {
  if (req.user) {
    const { postId } = req.body.postId;
    if (req.body.voterType === '') {
      Post.findByIdAndUpdate(
        { _id: postId },
        {
          $pull: {
            disliked: req.body.user,
          },
        }
      );
    }
  }
});
