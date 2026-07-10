import React from "react";
import { Link } from "react-router-dom";

const typeLabel = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  remote: "Remote",
};

const JobCard = ({ job }) => {
  const posted = new Date(job.createdAt);
  const daysAgo = Math.max(0, Math.floor((Date.now() - posted.getTime()) / 86400000));

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="card group flex flex-col gap-2 px-5 py-4 transition hover:border-gold hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.15em] text-rust">{job.company?.name}</p>
        <h3 className="truncate font-display text-lg font-600 text-ink group-hover:text-rust">
          {job.title}
        </h3>
        <p className="mt-1 text-sm text-slatewash">
          {job.location} &middot; {typeLabel[job.jobType] || job.jobType}
          {job.salaryMin || job.salaryMax
            ? ` \u00B7 ${job.currency} ${job.salaryMin || "?"}\u2013${job.salaryMax || "?"}`
            : ""}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-4 text-xs text-slatewash">
        <span className="rounded-full border border-ink/10 px-3 py-1 capitalize">
          {job.experienceLevel}
        </span>
        <span>{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}</span>
      </div>
    </Link>
  );
};

export default JobCard;
