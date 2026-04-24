const User = require("../models/User");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, jobTitle, location, weeklyGoal } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, jobTitle, location, weeklyGoal },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET SETTINGS
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("settings");
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE SETTINGS
exports.updateSettings = async (req, res) => {
  try {
    const { settingKey, value } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.settings[settingKey] = value;
    await user.save();
    
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
