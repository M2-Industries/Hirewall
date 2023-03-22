const request = require('supertest');
const server = 'http://localhost:3000';

describe('Route integration', () => {
  describe('GET /user', function() {
    it('responds with an array of user objects', function(done) {
      request(server)
        .get('/user')
        .expect(200)
        .then((response) => {
          const body = response._body;
          expect(Array.isArray(body)).toBe(true);
          expect(body[0]._id).toBeTruthy();
          expect(body[0].email).toBeTruthy();
          expect(body[0].password).toBeTruthy();
        })
        .then(done);
    });
  });
});
