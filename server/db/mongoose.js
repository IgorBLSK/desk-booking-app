// mongoose (MongoDB) database config
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/DeskApp');

module.exports = {mongoose};