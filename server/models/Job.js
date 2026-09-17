const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["Wishlist", "Applied", "OA", "Interview", "Offer", "Rejected"],
      default: "Applied",
      index: true
    },
    location: {
      type: String,
      default: "",
      trim: true
    },
    salary: {
      type: String,
      default: "",
      trim: true
    },
    recruiter: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      notes: { type: String, default: "" }
    },
    date: {
      type: Date,
      default: Date.now
    },
    link: {
      type: String,
      default: "",
      trim: true
    },
    notes: {
      type: String,
      default: ""
    },
    interviewDate: {
      type: Date
    },
    interviewTime: {
      type: String,
      default: ""
    },
    interviewType: {
      type: String,
      enum: ["Video call", "Phone call", "On-site", "Technical", "HR Round", "General", "Online Assessment"],
      default: "Video call"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual alias for role <-> title
jobSchema.virtual("role").get(function () {
  return this.title;
});

module.exports = mongoose.model("Job", jobSchema);