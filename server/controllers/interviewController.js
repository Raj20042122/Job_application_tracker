const Job = require("../models/Job");

exports.getUpcomingInterviews = async (req, res) => {
  try {
    const { upcoming } = req.query;
    
    if (upcoming === "true") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find jobs for the user that have status "Interview" and an interviewDate >= today
      const upcomingInterviews = await Job.find({
        user: req.user.id,
        status: "Interview",
        interviewDate: { $gte: today }
      })
      .sort({ interviewDate: 1 })
      .limit(3);

      return res.json(upcomingInterviews);
    }

    res.json([]);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
