const mysql = require('mysql2/promise');

// testing function that takes in an SQL query string
const testQuery = async query => {
  // create new connection pool to our AWS database
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
  
  try {
    const connection = await pool.getConnection();

    // group the SQL commands into a transaction and revert any changes using rollback after executing
    try {
      await connection.query('START TRANSACTION');
      const result = await connection.query(query);
      await connection.query('ROLLBACK');
      return result;
    } finally {
      connection.release();
    }
  } finally {
    await pool.end();
  }
}

/* transactions */
const showTables = `
  SHOW TABLES;
`;

const createUser = `
  INSERT INTO users (email, password) VALUES ('jestQueryTest@gmail.com', 'jestquerytest');
  SELECT * FROM users WHERE email='jestQueryTest@gmail.com';
`;

const updateUser = `
  INSERT INTO users (email, password) VALUES ('wrongEmail@gmail.com', 'jestquerytest');
  UPDATE users SET email='updatedEmail@gmail.com' WHERE email='wrongEmail@gmail.com';
  SELECT * FROM users WHERE email='wrongEmail@gmail.com';
  SELECT * FROM users WHERE email='updatedEmail@gmail.com';
`;
  
const deleteUser = `
  INSERT INTO users (email, password) VALUES ('shouldBeDeleted@gmail.com', 'shouldbedeleted');
  DELETE FROM users WHERE email='shouldBeDeleted@gmail.com';
  SELECT * FROM users WHERE email='jestQueryTest@gmail.com';
`;

describe('Test CRUD functionality for database tables', () => {
  // test that our three tables exist
  it('Should find the user, applications, and actions tables', async () => {
    const [rows] = await testQuery(`
      ${showTables}
    `)

    expect(rows[0].Tables_in_mydb).toBe('actions');
    expect(rows[1].Tables_in_mydb).toBe('applications');
    expect(rows[2].Tables_in_mydb).toBe('users');
  })

  // test that we can create a user
  it('Should create a new user in users', async () => {
    const [rows] = await testQuery(`
      ${createUser}
    `)

    expect(rows[1][0]).toBeTruthy();
  })

  // test that we can update a user
  it('Should be able to update a user in the users table', async () => {
    const [rows] = await testQuery(`
      ${updateUser}
    `)
    
    expect(rows[2][0]).not.toBeTruthy();
    expect(rows[3][0]).toBeTruthy();
  })

  // test that we can delete a user
  it('Should be able to delete a user in the users table', async () => {
    const [rows] = await testQuery(`
      ${deleteUser}
    `)
    
    expect(rows[1][0]).not.toBeTruthy();
  })
})
