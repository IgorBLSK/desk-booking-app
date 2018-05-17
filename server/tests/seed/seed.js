const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Desk} = require('./../../models/desk');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    fullName: "Test User One",
    email: "testOne@test.com",
    password: "userOnePass",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    fullName: "Test User Two",
    email: "testTwo@test.com",
    password: "userTwoPass",
}];

const desks = [{
    _id: new ObjectID(),
    deskNumber: "first test desk"
}, {
    _id: new ObjectID(),
    deskNumber: "second test desk",
    available: false,
    bookedAt: 333
}];

const populateDesks = (done) => {
    Desk.remove({}).then(() => {
        return Desk.insertMany(desks)
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

module.exports = {desks, populateDesks, users, populateUsers};