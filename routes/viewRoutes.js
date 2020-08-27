const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/post/:slug', authController.isLoggedIn, viewsController.getPost);
router.get('/create-post', authController.protect, viewsController.getCreate);
router.get('/me', authController.protect, viewsController.getAccount);

module.exports = router;
