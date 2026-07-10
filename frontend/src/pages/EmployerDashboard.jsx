import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/jobs/employer/mine").then(({ data }) => setJobs(data.jobs)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job posting? This cannot be undone.")) return;
    await api.delete(`/jobs/${id}`);
    setJobs(jobs.filter((j) => j._id !== id));
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === "open" ? "closed" : "open";
    const { data } = await api.put(`/jobs/${job._id}`, { status: newStatus });
    setJobs(jobs.map((j) => (j._id === job._id ? data.job : j)));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-700">Employer Dashboard</h1>
          <p className="mt-1 text-slatewash">Manage your job postings and review applicants.</p>
        </div>
        <Link to="/employer/post-job" className="btn-primary">Post a Job</Link>
      </div>

      {loading && <p className="mt-8 text-slatewash">Loading...</p>}
      {!loading && jobs.length === 0 && (
        <p className="mt-8 text-slatewash">You haven't posted any jobs yet.</p>
      )}

      <div className="mt-8 space-y-3">
        {jobs.map((job) => (
          <div key={job._id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-600">{job.title}</h3>
              <p className="text-sm text-slatewash">
                {job.location} &middot; {job.applicationsCount} applicant{job.applicationsCount === 1 ? "" : "s"} &middot;{" "}
                <span className={job.status === "open" ? "text-teal" : "text-rust"}>{job.status}</span>
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              <Link to={`/employer/jobs/${job._id}/applicants`} className="btn-secondary">Applicants</Link>
              <button onClick={() => toggleStatus(job)} className="btn-secondary">
                {job.status === "open" ? "Close" : "Reopen"}
              </button>
              <button onClick={() => handleDelete(job._id)} className="btn-secondary hover:border-rust hover:text-rust">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerDashboard;
