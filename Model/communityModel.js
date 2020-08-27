const mongoose = require('mongoose');
const slugify = require('slugify');

// Schema and Model
const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A community must have a name'],
      trim: true,
      minlength: [
        3,
        'A community name must be more than or equal 3 characters',
      ],
      maxlength: [
        40,
        'A community name must be less than or equal 40 characters',
      ],
    },
    slug: String,
    description: {
      type: String,
      trim: true,
    },
    image: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    users: [
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
communitySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;
