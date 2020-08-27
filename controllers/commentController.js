const Comment = require('../Model/commentModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const Post = require('../Model/postModel');

exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);

exports.createComment = catchAsync(async (req, res, next) => {
  // Set user id
  if (!req.body.user) req.body.user = req.user._id;

  //  Create Post
  const newComment = await Comment.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newComment,
    },
  });
});
