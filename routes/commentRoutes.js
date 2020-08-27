const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(commentController.getAllComments)
  .post(authController.protect, commentController.createComment);

router
  .route('/:id')
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
