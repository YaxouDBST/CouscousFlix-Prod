require('dotenv').config({ path: 'API/Mainapi/.env' });
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    await connection.query("ALTER TABLE user_sessions ADD COLUMN device TEXT AFTER user_type");
    console.log("Column device added successfully");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists");
    } else {
      console.error(err);
    }
  }
  process.exit(0);
}
run().catch(console.error);
