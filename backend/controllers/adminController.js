import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// @desc   Get platform stats
// @route  GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const [users, jobseekers, employers, jobs, openJobs, applications] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "jobseeker" }),
      User.countDocuments({ role: "employer" }),
      Job.countDocuments(),
      Job.countDocuments({ status: "open" }),
      Application.countDocuments(),
    ]);
    res.json({ users, jobseekers, employers, jobs, openJobs, applications });
  } catch (err) {
    next(err);
  }
};

// @desc   List all users
// @route  GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// @desc   Activate/deactivate a user
// @route  PUT /api/admin/users/:id/status
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc   List all jobs (including unapproved/closed)
// @route  GET /api/admin/jobs
export const getAllJobsAdmin = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate("employer", "name email company").sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
};

// @desc   Approve or reject a job posting
// @route  PUT /api/admin/jobs/:id/approve
export const toggleJobApproval = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    job.isApproved = !job.isApproved;
    await job.save();
    res.json({ job });
  } catch (err) {
    next(err);
  }
};
