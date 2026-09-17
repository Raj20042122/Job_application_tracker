const express = require("express");
const router = express.Router();

const {
  register,
  login,
  googleAuth,
  demoLogin,
  getMe,
  deleteAccount
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/demo", demoLogin);
router.get("/me", protect, getMe);
router.delete("/account", protect, deleteAccount);

module.exports = router;