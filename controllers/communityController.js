const Community = require('../Model/communityModel');
const factory = require('./handlerFactory');

exports.getAllCommunities = factory.getAll(Community);
exports.getCommunity = factory.getOne(Community);
exports.createCommunity = factory.createOne(Community);
exports.updateCommunity = factory.updateOne(Community);
exports.deleteCommunity = factory.deleteOne(Community);
