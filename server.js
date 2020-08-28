const mongoose = require('mongoose');
// loads environment variables from a .env file into process.env
const dotenv = require('dotenv');

// Config dotenv
dotenv.config({ path: './config.env' });

const app = require('./app');

// Set mongoose
mongoose.set('useFindAndModify', false);

// DB Connection
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

// Start server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 👿 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED! Shutting down gracefully!');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
