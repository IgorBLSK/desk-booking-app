var mongoose = require('mongoose');

var Desk = mongoose.model('Desk', {
    deskNumber: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    available: {
        type: Boolean,
        default: true
    },
    bookedAt: {
        type: Number,
        default: null
    },
    text: {
        type: String,
    }
});

module.exports = {Desk};