const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getUpcomingInterviews } = require("../controllers/interviewController");

router.route("/").get(protect, getUpcomingInterviews);

module.exports = router;
