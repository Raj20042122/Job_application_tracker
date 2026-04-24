const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getProfile, updateProfile, getSettings, updateSettings } = require("../controllers/userController");

router.route("/profile").get(protect, getProfile).put(protect, updateProfile);
router.route("/settings").get(protect, getSettings).put(protect, updateSettings);

module.exports = router;
