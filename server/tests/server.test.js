const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Desk} = require('./../models/desk');
const {User} = require('./../models/user')
const {desks, populateDesks, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateDesks);

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
            available: false,
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.desk.text).toBe(text);
            expect(res.body.desk.available).toBe(false);
            expect(res.body.desk.bookedAt).toBeA('number');
        })
        .end(done);
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
            expect(res.body.desk.bookedAt).toNotExist();
        })
        .end(done)
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticatated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done);
    });

    it('should return 401 when not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var fullName = 'John Doe';
        var email = 'example@example.com';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({fullName, email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.fullName).toBe(fullName);
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
            
            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            });
        });
    });
    
    it('should return validation errors if request invalid', (done) => {
        request(app)
        .post('/users')
        .send({
            email: 'and',
            password: '123'
        })
        .expect(400)
        .end(done);
    });

    it('should not create a user if email is in use', (done) => {
        request(app)
        .post('/users')
        .send({

            email: users[0].email,
            password: 'Password123!'
        })
        .expect(400)
        .end(done);
    });
});