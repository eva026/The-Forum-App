const mongoose = require('mongoose');

const Post = require('./postModel');

// Schema and Model
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Comment can not be empty!'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user!'],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'Comment must belong to a post!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate user
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// Static method
commentSchema.statics.calcCommentsQuantity = async function (postId) {
  // This points to the current model
  const stats = await this.aggregate([
    {
      $match: { post: postId },
    },
    {
      $group: {
        _id: '$post',
        nComment: { $sum: 1 },
      },
    },
  ]);

  console.log(stats);
  await Post.findByIdAndUpdate(postId, {
    commentsQuantity: stats[0].nComment,
  });
};

// When create a new comment
commentSchema.post('save', function () {
  // This points to the current doc, this.constructor points to the model
  this.constructor.calcCommentsQuantity(this.post);
});

// When update and delete a comment
// findByIdAndUpdate
// findByIdAndDelete
commentSchema.post(/^findOne/, async function (doc, next) {
  await doc.constructor.calcCommentsQuantity(doc.post);
  next();
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
