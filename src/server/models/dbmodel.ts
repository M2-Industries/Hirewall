import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'db-hirewall.cr6amg22ob1r.us-west-1.rds.amazonaws.com',
  user: 'admin',
  password: 'password',
  database: 'mydb',
  port: 3306,
});

export default connection;
