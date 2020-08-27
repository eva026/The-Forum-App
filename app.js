const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitiza = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const viewRouter = require('./routes/viewRoutes');
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
const communityRouter = require('./routes/communityRoutes');
const commentRouter = require('./routes/commentRoutes');
const voteupRouter = require('./routes/voteupRoutes');
const votedownRouter = require('./routes/votedownRoutes');
// const likeRouter = require('./routes/likeRoutes');
// const dislikeRouter = require('./routes/dislikeRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares

// Serve static file
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());
// development logging to console easily
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, read data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitiza());

// Data sanitization against xss
app.use(xss());

// text sent to client compression
app.use(compression());
// Routes
app.use('/', viewRouter);
app.use('/api/v1/posts/vote-up', voteupRouter);
app.use('/api/v1/posts/vote-down', votedownRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/communities', communityRouter);
app.use('/api/v1/comments', commentRouter);

// Undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
