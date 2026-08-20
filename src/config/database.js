const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        rejectUnauthorized: false
    },

    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err.message);
        return;
    }

    console.log('Connected to Aiven MySQL successfully');
    connection.release();
});

module.exports = pool.promise();