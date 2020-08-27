const express = require('express');
const communityController = require('../controllers/communityController');

const router = express.Router();

router
  .route('/')
  .get(communityController.getAllCommunities)
  .post(communityController.createCommunity);

router
  .route('/:id')
  .get(communityController.getCommunity)
  .patch(communityController.updateCommunity)
  .delete(communityController.deleteCommunity);

module.exports = router;
