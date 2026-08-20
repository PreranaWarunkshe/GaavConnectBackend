require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("./src/config/database");

const seedUser = async () => {
  let connection;

  try {
    connection = await pool.getConnection();

    console.log("Connected to MySQL database.");

    const userEmail = "test1@gaavconnect.com";
    const userPassword = "GaavPassword12";
    const userMobile = "9876543220";

    // Check if user already exists
    const [rows] = await connection.query(
      "SELECT id, email, mobile FROM users WHERE email = ? LIMIT 1",
      [userEmail]
    );

    if (rows.length === 0) {

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(userPassword, 10);

      await connection.query(
        `INSERT INTO users 
                (email, password, mobile)
                VALUES (?, ?, ?)`,
        [userEmail, hashedPassword, userMobile]
      );

      console.log("User created successfully!");

    } else {

      // Update password
      const hashedPassword = await bcrypt.hash(userPassword, 10);

      await connection.query(
        `UPDATE users
                 SET password = ?
                 WHERE email = ?`,
        [hashedPassword, userEmail]
      );

      console.log("User already exists, password updated!");
    }

    console.log(`Email: ${userEmail}`);
    console.log(`Password: ${userPassword}`);

  } catch (error) {

    console.error("❌ Error seeding user:", error.message);

  } finally {

    if (connection) {
      connection.release();
    }

    process.exit(0);
  }
};

seedUser();