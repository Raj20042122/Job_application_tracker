const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  createJob,
  getJobs,
  getJobStats,
  getJobById,
  updateJob,
  deleteJob
} = require("../controllers/jobController");

// Protected CRUD & Aggregation routes
router.post("/", protect, createJob);
router.get("/", protect, getJobs);
router.get("/stats", protect, getJobStats);
router.get("/:id", protect, getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;