const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Post = require('../Model/postModel');

const checkLike = (post, req, res) => {
  if (res.locals.user) {
    const userId = res.locals.user._id;
    if (post.liked && post.liked.includes(userId)) {
      res.locals.like = 1;
    }
    if (post.disliked && post.disliked.includes(userId)) {
      res.locals.dislike = 1;
    }
  }
};
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get data from the collection
  const posts = await Post.find().sort({ createdAt: -1 }).populate({
    path: 'user',
    fields: 'name photo',
  });

  if (res.locals.user) {
    const userId = res.locals.user._id;

    let objDis = {};
    let objLike = {};
    posts.forEach((post) => {
      if (post.liked.includes(userId)) {
        let postId = post._id;
        objLike[postId] = true;
      }
      if (post.disliked.includes(userId)) {
        let postId = post._id;
        objDis[postId] = true;
      }
    });

    res.locals.dislikes = objDis;
    res.locals.likes = objLike;
  }
  // console.log(res.locals);
  // 2) Build the template

  // 3) Render the template on the sever-side
  res.status(200).render('overview', {
    title: 'Homepage',
    posts,
  });
});
exports.getAccount = (req, res, next) => {
  res.status(200).render('account', {
    title: 'My Account',
  });
};
exports.getCreate = (req, res, next) => {
  res.status(200).render('create', {
    title: 'Create Post',
  });
};

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug })
    .populate({
      path: 'user',
      fields: 'name photo',
    })
    .populate({
      path: 'comments',
      fields: 'comment',
    });

  // console.log(post);
  if (!post) {
    return next(new AppError('There is no post with this title!', 404));
  }

  checkLike(post, req, res);
  // if (res.locals.user) {
  //   const userId = res.locals.user._id;
  //   if (post.liked && post.liked.includes(userId)) {
  //     res.locals.like = 1;
  //   }
  //   if (post.disliked && post.disliked.includes(userId)) {
  //     res.locals.dislike = 1;
  //   }
  // }
  // 2) Build the template

  // 3) Render the template

  res.status(200).render('post', {
    title: `${post.title} Post`,
    post,
  });
});
