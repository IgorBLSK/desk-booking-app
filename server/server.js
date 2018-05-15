require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Desk} = require('./models/desk');
var {User} = require('./models/user');

var app = express();
// setup for Heroku
const port = process.env.PORT;

// body parser converts json to an object send to req
app.use(bodyParser.json());

// create new desk in db
app.post('/desks', (req, res) => {
    var desk = new Desk({
        deskNumber: req.body.deskNumber,
        text: req.body.text
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

// update an existing desk
app.patch('/desks/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['deskNumber', 'available', 'text']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.available) && body.available) {
        body.bookedAt = null;
    } else {
        // var time = new Date().getTime();
        // var date = new Date(time);
        body.bookedAt = new Date().getTime();
        body.available = false;
    }

    Desk.findByIdAndUpdate(id, {$set: body}, {new: true}).then((desk) => {
        if(!desk) {
            return res.status(404).send();
        }

        res.send({desk});
    }).catch((e) => {
        res.status(400).send();
    })
});

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['fullName', 'email', 'password'])
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};