const mysql = require('mysql2/promise');

// create the connection pool
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

// execute the queries
async () => {
  try {
    const connection = await pool.getConnection();

    await connection.query(`
      CREATE TABLE users (
        _id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE applications (
        _id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        company VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        job_title VARCHAR(100) NOT NULL,
        salary VARCHAR(15),
        last_action_id_fk INT,
        comments VARCHAR(1000)
      );
    `);

    await connection.query(`
      CREATE TABLE actions (
        _id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        application_id_fk INT NOT NULL,
        date DATETIME,
        action_type VARCHAR(100) NOT NULL,
        notes VARCHAR(1000) NOT NULL
      );
    `);

    await connection.query(`
      ALTER TABLE applications
      ADD CONSTRAINT fk_applications_users
      FOREIGN KEY (user_id)
      REFERENCES users(_id);
    `);

    await connection.query(`
      ALTER TABLE actions
      ADD CONSTRAINT fk_actions_applications
      FOREIGN KEY (application_id_fk)
      REFERENCES applications(_id);
    `);

    await connection.query(`
      ALTER TABLE applications
      ADD CONSTRAINT fk_applications_actions
      FOREIGN KEY (last_action_id_fk)
      REFERENCES actions(_id);
    `);

    console.log('All tables were created successfully.');

    // release the connection
    connection.release();
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};
