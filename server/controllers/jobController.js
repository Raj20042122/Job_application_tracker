const mongoose = require("mongoose");
const Job = require("../models/Job");

// CREATE JOB
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      role,
      company,
      status,
      location,
      salary,
      recruiter,
      link,
      jobUrl,
      notes,
      date,
      interviewDate,
      interviewTime,
      interviewType
    } = req.body;

    const jobTitle = title || role;
    if (!jobTitle || !company) {
      return res.status(400).json({ success: false, msg: "Job title and company are required." });
    }

    const job = await Job.create({
      title: jobTitle.trim(),
      company: company.trim(),
      status: status || "Applied",
      location: location || "",
      salary: salary || "",
      recruiter: typeof recruiter === "object" ? recruiter : { name: recruiter || "" },
      link: link || jobUrl || "",
      notes: notes || "",
      date: date ? new Date(date) : new Date(),
      interviewDate: interviewDate ? new Date(interviewDate) : undefined,
      interviewTime: interviewTime || "",
      interviewType: interviewType || "Video call",
      user: req.user.id
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// GET ALL JOBS
exports.getJobs = async (req, res) => {
  try {
    const {
      status,
      search,
      page,
      limit,
      sort = "-createdAt"
    } = req.query;

    const query = { user: new mongoose.Types.ObjectId(req.user.id) };

    if (status && status !== "All") {
      query.status = status;
    }

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: regex },
        { company: regex },
        { location: regex },
        { notes: regex },
        { "recruiter.name": regex }
      ];
    }

    // Build sort
    let sortOption = { createdAt: -1 };
    if (sort === "company") sortOption = { company: 1 };
    if (sort === "-company") sortOption = { company: -1 };
    if (sort === "status") sortOption = { status: 1 };
    if (sort === "date") sortOption = { date: 1 };
    if (sort === "-date") sortOption = { date: -1 };
    if (sort === "createdAt") sortOption = { createdAt: 1 };
    if (sort === "-createdAt") sortOption = { createdAt: -1 };

    const total = await Job.countDocuments(query);

    let queryBuilder = Job.find(query).sort(sortOption);

    // Apply pagination only if page and limit are specified
    if (page && limit && limit !== "all") {
      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.max(1, parseInt(limit, 10));
      queryBuilder = queryBuilder.skip((pageNum - 1) * limitNum).limit(limitNum);

      const jobs = await queryBuilder;
      return res.json({
        success: true,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        data: jobs
      });
    }

    const jobs = await queryBuilder;
    res.json({
      success: true,
      total,
      data: jobs
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// GET JOB STATS & REAL ANALYTICS
exports.getJobStats = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Group counts by status
    const statusCounts = await Job.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const result = {
      Wishlist: 0,
      Applied: 0,
      OA: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    let totalApplications = 0;
    statusCounts.forEach((item) => {
      if (result.hasOwnProperty(item._id)) {
        result[item._id] = item.count;
      }
      totalApplications += item.count;
    });

    // 2. Real Week-over-Week Calculation
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [thisWeekCount, lastWeekCount] = await Promise.all([
      Job.countDocuments({
        user: userObjectId,
        createdAt: { $gte: sevenDaysAgo }
      }),
      Job.countDocuments({
        user: userObjectId,
        createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
      })
    ]);

    let weeklyDeltaPercent = 0;
    if (lastWeekCount > 0) {
      weeklyDeltaPercent = Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
    } else if (thisWeekCount > 0) {
      weeklyDeltaPercent = 100;
    }

    // 3. Response rate & Funnel metrics
    const responses = (result.OA || 0) + (result.Interview || 0) + (result.Offer || 0) + (result.Rejected || 0);
    const responseRate = totalApplications > 0 ? Math.round((responses / totalApplications) * 100) : 0;
    const interviewRate = totalApplications > 0 ? Math.round(((result.Interview + result.Offer) / totalApplications) * 100) : 0;
    const offerRate = totalApplications > 0 ? Math.round((result.Offer / totalApplications) * 100) : 0;

    // 4. Monthly application timeline (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyAggregation = await Job.aggregate([
      {
        $match: {
          user: userObjectId,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const timeline = [];
    const tempDate = new Date(sixMonthsAgo);
    for (let i = 0; i < 6; i++) {
      const year = tempDate.getFullYear();
      const month = tempDate.getMonth() + 1;
      const monthLabel = monthNames[month - 1];

      const found = monthlyAggregation.find(
        (m) => m._id.year === year && m._id.month === month
      );

      timeline.push({
        name: monthLabel,
        year,
        applications: found ? found.count : 0
      });

      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    res.json({
      success: true,
      total: totalApplications,
      statusCounts: result,
      thisWeekCount,
      lastWeekCount,
      weeklyDeltaPercent,
      responseRate,
      interviewRate,
      offerRate,
      timeline,
      ...result
    });
  } catch (error) {
    console.error("Get job stats error:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// GET SINGLE JOB BY ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, msg: "Application not found." });
    }

    if (job.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, msg: "Not authorized to view this application." });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// UPDATE JOB
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, msg: "Application not found." });
    }

    if (job.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, msg: "Not authorized to edit this application." });
    }

    const updates = { ...req.body };
    if (updates.role && !updates.title) {
      updates.title = updates.role;
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedJob });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// DELETE JOB
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, msg: "Application not found." });
    }

    if (job.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, msg: "Not authorized to delete this application." });
    }

    await job.deleteOne();

    res.json({ success: true, msg: "Application deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};