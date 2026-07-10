import Application from "../models/Application.js";
import Job from "../models/Job.js";

// @desc   Apply to a job (jobseeker only)
// @route  POST /api/applications/:jobId
export const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "open") {
      return res.status(400).json({ message: "This job is no longer accepting applications" });
    }

    const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : req.body.resumeUrl;
    if (!resumeUrl) {
      return res.status(400).json({ message: "A resume is required to apply" });
    }

    const existing = await Application.findOne({ job: job._id, applicant: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      employer: job.employer,
      coverLetter: req.body.coverLetter || "",
      resumeUrl,
    });

    job.applicationsCount += 1;
    await job.save();

    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
};

// @desc   Get applications submitted by the logged-in job seeker
// @route  GET /api/applications/mine
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location jobType status")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    next(err);
  }
};

// @desc   Get applicants for a specific job (employer who owns the job, or admin)
// @route  GET /api/applications/job/:jobId
export const getApplicantsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only view applicants for your own jobs" });
    }

    const applications = await Application.find({ job: job._id })
      .populate("applicant", "name email headline skills resumeUrl")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    next(err);
  }
};

// @desc   Update application status (employer or admin)
// @route  PUT /api/applications/:id/status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["applied", "reviewed", "shortlisted", "rejected", "hired"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only manage applications for your own jobs" });
    }

    application.status = status;
    await application.save();
    res.json({ application });
  } catch (err) {
    next(err);
  }
};
