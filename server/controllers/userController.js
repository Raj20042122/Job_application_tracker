const User = require("../models/User");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, jobTitle, location, weeklyGoal } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ...(name && { name }),
          ...(jobTitle !== undefined && { jobTitle }),
          ...(location !== undefined && { location }),
          ...(weeklyGoal !== undefined && { weeklyGoal: Number(weeklyGoal) })
        }
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// GET SETTINGS
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("settings");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.json(user.settings || {});
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// UPDATE SETTINGS
exports.updateSettings = async (req, res) => {
  try {
    const { settingKey, value } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (!user.settings) {
      user.settings = {};
    }
    user.settings[settingKey] = value;
    user.markModified("settings");
    await user.save();

    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
