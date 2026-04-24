const Job = require("../models/Job");

// CREATE JOB
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET ALL JOBS (only logged-in user)
exports.getJobs = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 5, sort = "-createdAt" } = req.query;

    let query = { user: req.user.id };

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }

    const jobs = await Job.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: jobs
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getJobStats = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const stats = await Job.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    let result = {
      Applied: 0,
      Interview: 0,
      Rejected: 0,
      Offer: 0
    };

    stats.forEach((item) => {
      result[item._id] = item.count;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET SINGLE JOB
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // check ownership
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE JOB
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ msg: "Job not found" });

    // check ownership
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// DELETE JOB
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ msg: "Job not found" });

    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await job.deleteOne();

    res.json({ msg: "Job deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};