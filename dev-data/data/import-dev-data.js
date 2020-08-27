const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const Post = require('../../Model/postModel');
// const User = require('../../Model/userModel');
const Comment = require('../../Model/commentModel');
// const Community = require('../../Model/communityModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful.'));

// console.log(app.get('env'));
// console.log(process.env);

const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, 'utf-8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const communities = JSON.parse(
//   fs.readFileSync(`${__dirname}/communities.json`, 'utf-8')
// );
const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/comments.json`, 'utf-8')
);
const importData = async () => {
  try {
    // await Post.create(posts);
    // await User.create(users, { validateBeforeSave: false });
    await Comment.create(comments);
    // await Community.create(communities);
    console.log('Data successfully loaded.');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    // await Post.deleteMany();
    // await User.deleteMany();
    await Comment.deleteMany();
    // await Community.deleteMany();
    console.log('Data successfully deleted.');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
