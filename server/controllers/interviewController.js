const Job = require("../models/Job");

exports.getUpcomingInterviews = async (req, res) => {
  try {
    const { upcoming } = req.query;
    const query = {
      user: req.user.id,
      interviewDate: { $exists: true, $ne: null }
    };

    if (upcoming === "true") {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      query.interviewDate = { $gte: startOfToday };
    }

    const interviews = await Job.find(query)
      .sort({ interviewDate: 1 })
      .limit(upcoming === "true" ? 6 : 50);

    res.json(interviews);
  } catch (error) {
    console.error("Get interviews error:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};
