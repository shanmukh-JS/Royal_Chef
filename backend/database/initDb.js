const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDb() {
  console.log('Connecting to MySQL server...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // Allows running multiple queries at once
  });

  try {
    console.log('Reading schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    console.log('Executing schema queries...');
    await connection.query(schemaSql);
    console.log('Schema setup completed successfully.');

    console.log('Reading seed.sql...');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

    console.log('Executing seed queries...');
    await connection.query(seedSql);
    console.log('Database seeding completed successfully.');

  } catch (error) {
    console.error('Error during database initialization:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
    console.log('Database connection closed.');
  }
}

initDb();
