const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    jobTitle: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    weeklyGoal: {
      type: Number,
      default: 5
    },
    settings: {
      followUpReminders: { type: Boolean, default: true },
      interviewAlerts: { type: Boolean, default: true },
      weeklySummary: { type: Boolean, default: false },
      goalAlert: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: true },
      compactView: { type: Boolean, default: false },
      shareAnalytics: { type: Boolean, default: true },
      twoFactorAuth: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);