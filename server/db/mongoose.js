// mongoose (MongoDB) database config
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(proces.env.MONGODB_URI || 'mongodb://localhost:27017/DeskApp');

module.exports = {mongoose};