const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    console.warn("⚠️  Server is running, but MongoDB is disconnected. Please check your MONGO_URI in server/.env");
  }
};

module.exports = connectDB;