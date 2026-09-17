const mongoose = require("mongoose");
const User = require("../models/User");
const Job = require("../models/Job");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkDbConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      msg: "Database is temporarily disconnected. Please verify your MongoDB connection."
    });
    return false;
  }
  return true;
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d"
  });
};

const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  return userObj;
};

// REGISTER
exports.register = async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, msg: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, msg: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, msg: error.message || "Registration failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, msg: "Invalid email or password." });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        msg: "This account was registered with Google. Please use 'Continue with Google' to sign in."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, msg: error.message || "Login failed" });
  }
};

// GOOGLE OAUTH
exports.googleAuth = async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, msg: "Google credential token is required." });
    }

    // Verify Google ID Token using Google's public tokeninfo endpoint
    let googleData;
    try {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      if (!response.ok) {
        throw new Error("Failed to verify Google token with Google servers");
      }
      googleData = await response.json();
    } catch (err) {
      return res.status(401).json({ success: false, msg: "Invalid Google credential token." });
    }

    const { email, name, picture, sub: googleId } = googleData;
    if (!email) {
      return res.status(400).json({ success: false, msg: "Google account does not have a verified email." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({
      $or: [{ googleId }, { email: normalizedEmail }]
    });

    if (user) {
      let shouldSave = false;
      if (!user.googleId) {
        user.googleId = googleId;
        shouldSave = true;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
        shouldSave = true;
      }
      if (shouldSave) await user.save();
    } else {
      user = await User.create({
        name: name || "Google User",
        email: normalizedEmail,
        googleId,
        avatar: picture || "",
        settings: {
          darkMode: true,
          followUpReminders: true,
          interviewAlerts: true
        }
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ success: false, msg: error.message || "Google authentication failed" });
  }
};

// DEMO LOGIN (Convenient 1-click test mode)
exports.demoLogin = async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;

    const demoEmail = "demo.user@jobtracker.io";
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      const hashedPassword = await bcrypt.hash("demo123456", 10);
      user = await User.create({
        name: "Demo Professional",
        email: demoEmail,
        password: hashedPassword,
        jobTitle: "Senior Software Engineer",
        location: "San Francisco, CA",
        weeklyGoal: 8
      });

      // Populate a few initial demo jobs if creating for the first time
      const today = new Date();
      await Job.create([
        {
          title: "Full Stack Engineer",
          company: "Stripe",
          status: "Interview",
          location: "San Francisco, CA (Hybrid)",
          salary: "$160k - $185k",
          link: "https://stripe.com/jobs",
          notes: "Spoke with recruiter Sarah. Preparing system design round.",
          interviewDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
          interviewTime: "2:00 PM PST",
          interviewType: "Video call",
          recruiter: { name: "Sarah Chen", email: "schen@stripe.com" },
          user: user._id
        },
        {
          title: "Frontend Architect",
          company: "Linear",
          status: "OA",
          location: "Remote",
          salary: "$170k - $200k",
          link: "https://linear.app/careers",
          notes: "Take-home code assessment submitted. Awaiting review.",
          user: user._id
        },
        {
          title: "Product Engineer",
          company: "Vercel",
          status: "Applied",
          location: "Remote",
          salary: "$150k - $175k",
          link: "https://vercel.com/careers",
          notes: "Referred by Alex. Applied via careers portal.",
          user: user._id
        },
        {
          title: "Senior UI/UX Engineer",
          company: "Figma",
          status: "Wishlist",
          location: "San Francisco, CA",
          salary: "$180k - $210k",
          link: "https://figma.com/careers",
          notes: "Need to polish portfolio design examples before submitting.",
          user: user._id
        },
        {
          title: "Staff Software Engineer",
          company: "Datadog",
          status: "Offer",
          location: "New York, NY (Hybrid)",
          salary: "$195k + Equity",
          link: "https://datadoghq.com/careers",
          notes: "Official offer received! Reviewing benefits and compensation packet.",
          user: user._id
        }
      ]);
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Demo login error:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// GET CURRENT USER PROFILE
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await Job.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    res.json({ success: true, msg: "Account and all associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};