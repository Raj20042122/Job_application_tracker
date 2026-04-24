const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // ❌ remove password before sending
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json(userObj);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ❌ remove password before sending
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token, user: userObj });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GOOGLE AUTH
const { OAuth2Client } = require('google-auth-library');
const googleClientId = process.env.GOOGLE_CLIENT_ID || "165506773774-m339030valies37h6fafc3ffje4v6bme.apps.googleusercontent.com";
const client = new OAuth2Client(googleClientId);

exports.googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ msg: "Google access_token is required" });
    }

    // Use google-auth-library to securely fetch user info using access token
    client.setCredentials({ access_token });
    const response = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });
    
    const { sub, email, name } = response.data;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create user with a random secure password since they use Google Auth
      const randomPassword = await bcrypt.hash(sub + Math.random().toString(), 10);
      user = await User.create({
        name,
        email,
        password: randomPassword
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    // Remove password before sending
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token, user: userObj });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ msg: "Authentication failed. " + error.message });
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    // Delete all jobs related to user
    const Job = require("../models/Job");
    await Job.deleteMany({ user: userId });
    // Delete user
    await User.findByIdAndDelete(userId);
    res.json({ msg: "Account and all associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};