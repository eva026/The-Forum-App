const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Post = require('../Model/postModel');

exports.voteUp = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);
  console.log(post);
  const user = req.user._id;
  const likeArr = post.liked;

  //  if post.liked not empty array and If user already like
  if (post.liked.length > 0 && post.liked.includes(user)) {
    const idx = likeArr.indexOf(user);

    likeArr.splice(idx, 1);

    // If user not already like
  } else if ((post.liked.length = 0 || !post.liked.includes(user))) {
    // If user already dislike
    if (post.disliked.length > 0 && post.disliked.includes(user)) {
      const indDis = post.disliked.indexOf(user);

      post.liked.push(user);
      post.disliked.splice(indDis, 1);
    } else {
      // If user not already dislike
      post.liked.push(user);
    }
  }
  await post.save();

  const newPost = await Post.findById({ _id: postId });
  res.status(200).json({
    status: 'success',
    data: newPost,
  });
});
exports.voteDown = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);
  console.log(post);
  const user = req.user._id;
  const dislikeArr = post.disliked;

  //  if post.disliked not empty array and If user already dislike
  if (post.disliked.length > 0 && post.disliked.includes(user)) {
    const idx = dislikeArr.indexOf(user);

    dislikeArr.splice(idx, 1);

    // If user not already dislike
  } else if ((post.disliked.length = 0 || !post.disliked.includes(user))) {
    // If user already like
    if (post.liked.length > 0 && post.liked.includes(user)) {
      const indDis = post.liked.indexOf(user);

      post.disliked.push(user);
      post.liked.splice(indDis, 1);
    } else {
      // If user not already like
      post.disliked.push(user);
    }
  }
  await post.save();

  const newPost = await Post.findById({ _id: postId });
  res.status(200).json({
    status: 'success',
    data: newPost,
  });
});
