require('dotenv').config();
const sequelize = require('./src/config/database');
const User = require('./src/models/User');

const seedUser = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // Ensure table exists

    const userEmail = "test@gaavconnect.com";
    const userPassword = "GaavPassword123";
    
    // Check if user already exists
    let user = await User.findOne({ where: { email: userEmail } });
    
    if (!user) {
       user = await User.create({
          email: userEmail,
          password: userPassword,
          mobile: "9876543210"
       });
       console.log("User created successfully!");
    } else {
       // Update password if user exists so we are sure what it is
       user.password = userPassword;
       await user.save();
       console.log("User already exists, password updated!");
    }
    
    console.log(`Email: ${userEmail}`);
    console.log(`Password: ${userPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding user:", error);
    process.exit(1);
  }
};

seedUser();
