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

  await connection.query("CREATE TABLE IF NOT EXISTS films (id VARCHAR(255) PRIMARY KEY, links JSON DEFAULT NULL, download_links JSON DEFAULT NULL)");
  await connection.query("CREATE TABLE IF NOT EXISTS series (id VARCHAR(255) PRIMARY KEY, links JSON DEFAULT NULL, download_links JSON DEFAULT NULL)");
  await connection.query("CREATE TABLE IF NOT EXISTS animes (id VARCHAR(255) PRIMARY KEY, links JSON DEFAULT NULL, download_links JSON DEFAULT NULL)");
  
  console.log("Tables created successfully");
  process.exit(0);
}
run().catch(console.error);
