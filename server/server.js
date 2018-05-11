var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Desk} = require('./models/desk');
var {User} = require('./models/user');

var app = express();
// setup for Heroku
const port = process.env.PORT || 3000;

// body parser converts json to an object send to req
app.use(bodyParser.json());

// create new desk in db
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

// get all desks
app.get('/desks', (req, res) => {
    Desk.find().then((desks) => {
        res.send({desks})
    }, (e) => {
        res.status(400).send(e);
    })
});

// get all free desks
app.get('/desks/available', (req, res) => {
    Desk.find({
        available: true
    }).then((desks) => {
        res.send({desks})
    }, (e) => {
        res.status(400).send(e);
    })
});

// find desk by ID
app.get('/desks/:id', (req, res) => {
    var id = req.params.id;
    
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Desk.findById(id).then((desk) => {
        if(!desk) {
            return res.status(404).send();
        }    
    res.send({desk});
    }).catch((e)=> {
        res.status(400).send();
    });
});

// delete desk by ID
app.delete('/desks/:id', (req,res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Desk.findByIdAndRemove(id).then((desk) => {
        if(!desk) {
            return res.status(404).send();
        }
    res.send({desk});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};