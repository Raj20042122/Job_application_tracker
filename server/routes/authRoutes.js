const express = require("express");
const router = express.Router();

const { register, login, googleAuth, deleteAccount } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.delete("/account", protect, deleteAccount);

module.exports = router;