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
  INSERT INTO users (email, password) VALUES ('evan@gmail.com', 'mypassword');
`;
  
const checkUsers = `
  SELECT * FROM users;  
`;

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
  const [resultSetHeader] = await testQuery(`
    ${createUser}
  `)
})

// test that we can access all the users
it('Should be able to access the users in the users table', async () => {
  const [rows] = await testQuery(`
    ${checkUsers}
  `)
  
  console.log(rows);
})
