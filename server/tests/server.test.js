const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Desk} = require('./../models/desk');

const desks = [{
    deskNumber: "first test desk"
}, {
    deskNumber: "second test desk"
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