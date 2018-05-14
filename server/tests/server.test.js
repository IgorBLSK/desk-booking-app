const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Desk} = require('./../models/desk');

const desks = [{
    _id: new ObjectID(),
    deskNumber: "first test desk"
}, {
    _id: new ObjectID(),
    deskNumber: "second test desk",
    available: false,
    bookedAt: 333
}];

beforeEach((done) => {
    Desk.remove({}).then(() => {
        return Desk.insertMany(desks)
    }).then(() => done());
});

describe('POST /desks', () => {
    it('should create a new desk', (done) => {
        var deskNumber = 'Test desk number';

        request(app)
            .post('/desks')
            .send({deskNumber})
            .expect(200)
            .expect((res) => {
                expect(res.body.deskNumber).toBe(deskNumber);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Desk.find({deskNumber}).then((desks) => {
                    expect(desks.length).toBe(1);
                    expect(desks[0].deskNumber).toBe(deskNumber);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create desk with invalid body data', (done) => {
        request(app)
            .post('/desks')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Desk.find().then((desks) => {
                    expect(desks.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });

    });
});

describe('GET /desks', () => {
    it('should get all desks', (done) => {
        request(app)
        .get('/desks')
        .expect(200)
        .expect((res) => {
            expect(res.body.desks.length).toBe(2)
        })
        .end(done)
    });
});

describe('GET /desks/:id', () => {
    it('should return desk doc', (done) => {
        request(app)
        .get(`/desks/${desks[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.desk.deskNumber).toBe(desks[0].deskNumber)
        })
        .end(done);
    });

    it('should return 404 if desk not found', (done) => {
        var hexId = new ObjectID().toHexString(); 

        request(app)
        .get(`/desks/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-objects IDs', (done) => {
        request(app)
        .get('/desks/123abc')
        .expect(404)
        .end(done);
    });
});
// nefunguje, neviem preco
describe('DELETE /desks/:id', () => {
    it('should remove a desk', (done) => {
        var hexId = desks[1]._id.toHexString();

        request(app)
        .delete(`/desks/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.desk._id).toBe(hexId);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Desk.findById(hexId).then((desk) => {
                expect(desk).toNotExist();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return 404 if desk not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
        .delete(`/desks/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete('/desks/123abc')
        .expect(404)
        .end(done);
    });
});
// nefunguje, neviem preco
describe('PATCH /desks/:id', () => {
    it('should update the desk', (done) => {
        var hexId = desks[1]._id.toHexString();
        var text = 'This should be the new text';

        request(app)
        .patch(`/desks/${hexId}`)
        .send({
            avaialable: false,
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.desk.text).toBe(text);
            expect(res.body.desk.available).toBe(false);
            expect(res.body.desk.completedAt).toBeA('number');
        })
        .end(done)
    });

    it('should clear bookedAt when desk is available', (done) => {
        var hexId = desks[0]._id.toHexString();
        var text = 'This should be the new text';

        request(app)
        .patch(`/desks/${hexId}`)
        .send({
            avaialable: true,
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.desk.text).toBe(text);
            expect(res.body.desk.available).toBe(true);
            expect(res.body.desk.completedAt).toNotExist();
        })
        .end(done)
    });
})