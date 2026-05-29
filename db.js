// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "userdb",
  password: "giang2k6",
  port: 5432,
});

module.exports = pool;