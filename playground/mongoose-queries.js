const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Desk} = require('./../server/models/desk');
const {User} = require('./../server/models/user')

var id = '5af41b195d96de06d7183e74';

if (!ObjectID.isValid(id)) {
    console.log('ID is not valid');
}

Desk.find({
    _id: id
}).then((desks) => {
    console.log('Desks', desks);
});

Desk.findOne({
    _id: id
}).then((desk) => {
    console.log('Desk', desk);
});

Desk.findById(id).then((desk) => {
    if(!desk) {
        return console.log('Id not found');
    }
    console.log('Desk by Id', desk);
}).catch((e) => console.log(e));

User.findById(id).then((user) => {
    if(!user) {
        return console.log('User not found');
    }
    console.log('User by Id', user);
}).catch((e) => console.log(e));