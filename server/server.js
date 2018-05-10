var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Desk} = require('./models/desk');
var {User} = require('./models/user');

var app = express();

// body parser converts json to an object send to req
app.use(bodyParser.json());

app.post('/desks', (req, res) => {
    var desk = new Desk({
        deskNumber: req.body.deskNumber
    });

    desk.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/desks', (req, res) => {
    Desk.find().then((desks) => {
        res.send({desks})
    }, (e) => {
        res.status(400).send(e);
    })
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};