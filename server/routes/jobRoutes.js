const express = require("express");
const router = express.Router();
const { getJobById } = require("../controllers/jobController");
const { getJobStats } = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob
} = require("../controllers/jobController");

// protected routes
router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getJobs);

// ✅ PUT THIS BEFORE :id
router.get("/stats", authMiddleware, getJobStats);

router.get("/:id", authMiddleware, getJobById);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;