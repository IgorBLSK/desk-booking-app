// connect to mongo server and pull off ObjectID const.funct.(destructuring)
const {MongoClient, ObjectID} = require('mongodb');

// provide url (local in this case) and db name (DeskApp)
MongoClient.connect('mongodb://localhost:27017/DeskApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('DeskApp');

    // CREATE/UPDATE DESK COLLECTION
    // db.collection('Desks').insertOne({
    //     number: '6',
    //     available: true
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to create a new desk', err)
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // CREATE/UPDATE USER COLLECTION
    db.collection('Users').insertOne({
        fullName: 'Martin Weber',
        location: 'Bratislava'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user', err)
        }

        console.log(result.ops);
    });

    client.close();
});