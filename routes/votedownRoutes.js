const express = require('express');
const voteController = require('../controllers/voteController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/:id').put(authController.protect, voteController.voteDown);

module.exports = router;
