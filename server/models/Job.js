const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Rejected", "Offer"],
      default: "Applied"
    },
    date: {
      type: Date,
      default: Date.now
    },
    link: {
      type: String
    },
    notes: {
      type: String
    },
    interviewDate: {
      type: Date
    },
    interviewTime: {
      type: String
    },
    interviewType: {
      type: String,
      enum: ["Video call", "Phone call", "On-site", "Technical", "HR Round", "General"],
      default: "Video call"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Job", jobSchema);