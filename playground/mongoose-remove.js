const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Desk} = require('./../server/models/desk');
const {User} = require('./../server/models/user')

// remove all desks from db
Desk.remove({}).then((result) => {
    console.log(result);
});

// remove one desk from db
Desk.findOneAndRemove({
    _id: "5af572c2e3a1810219af06f7",
    available: true
}).then((desk) => {
    console.log(desk)
});

// find by ID and remove
Desk.findByIdAndRemove("5af572c2e3a1810219af06f7").then((desk) => {
    console.log(desk);
});