import Job from "../models/Job.js";
import Application from "../models/Application.js";

// @desc   Create a job (employer only)
// @route  POST /api/jobs
export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      ...req.body,
      employer: req.user._id,
      company: {
        name: req.body.companyName || req.user.company?.name || req.user.name,
        logoUrl: req.user.company?.logoUrl || "",
      },
    });
    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all jobs with search, filters, pagination
// @route  GET /api/jobs
export const getJobs = async (req, res, next) => {
  try {
    const {
      q,
      location,
      jobType,
      category,
      experienceLevel,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { status: "open", isApproved: true };

    if (q) filter.$text = { $search: q };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = jobType;
    if (category) filter.category = category;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.json({
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single job by id
// @route  GET /api/jobs/:id
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("employer", "name company email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

// @desc   Update a job (owner employer only)
// @route  PUT /api/jobs/:id
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only edit your own job postings" });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete a job (owner employer or admin)
// @route  DELETE /api/jobs/:id
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own job postings" });
    }

    await job.deleteOne();
    await Application.deleteMany({ job: job._id });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// @desc   Get jobs posted by the logged-in employer
// @route  GET /api/jobs/employer/mine
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
};
