// pool of connections

const mysql = require("mysql2/promise"); // mysql2 support promises

const pool = mysql.createPool({
  host: "localhost",
  database: "blog",
  user: "Khalid",
  password: "password",
});

module.exports = pool;
