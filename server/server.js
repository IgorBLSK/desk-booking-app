var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Desk} = require('./models/desk');
var {User} = require('./models/user');

var app = express();

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

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};