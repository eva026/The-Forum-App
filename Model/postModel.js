const mongoose = require('mongoose');
const slugify = require('slugify');

// Schema and Model
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must have a title'],
      trim: true,
      minlength: [10, 'A post title must be more than or equal 10 characters'],
      maxlength: [
        1000,
        'A post title must be less than or equal 1000 characters',
      ],
    },
    slug: String,
    community: {
      type: mongoose.Schema.ObjectId,
      ref: 'Community',
      required: [true, 'Post must belong to a community!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Post must belong to a user!'],
    },
    text: String,
    image: String,
    commentsQuantity: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    liked: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    disliked: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// DOCUMENT MIDDLEWARE: runs before .save() or .create()
postSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Virtual populate
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'community',
    select: 'name image',
  });
  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
