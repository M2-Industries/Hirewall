const request = require('supertest');
const server = 'http://localhost:3000';
const mysql = require('mysql2/promise');

describe('Route integration', () => {
  describe('POST /user/create', function() {   
    const pool = mysql.createPool({
      host: 'db-hirewall.cr6amg22ob1r.us-west-1.rds.amazonaws.com',
      user: 'admin',
      password: 'password',
      database: 'mydb',
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true,
    });
    
    it('should create a new user in the database', async () => {
      const email = 'supertest@gmail.com';
      const password = 'superpassword';
      const userData = {
        email: email,
        password: password,
      };

      const response = await request(server)
        .post('/user/create')
        .send(userData);
      
      // check if the user was actually created in the database      
      const connection = await pool.getConnection();
      const dbResponse = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      expect(dbResponse[0][0].email).toBe(email);
    }, 10000);

    it('does not allow us to create two users with the same email', async () => {
      const email = 'supertest@gmail.com';
      const password = 'superpassword';
      const userData = {
        email: email,
        password: password,
      };

      const response = await request(server)
        .post('/user/create')
        .send(userData);
      
      expect(response.status).toBe(409);

      // delete the user we created
      const connection = await pool.getConnection();
      connection.query(
        `DELETE FROM users WHERE email='supertest@gmail.com';`
      );
    });
  });
});
