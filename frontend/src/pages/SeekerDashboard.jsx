import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const statusColor = {
  applied: "text-slatewash",
  reviewed: "text-ink",
  shortlisted: "text-teal",
  rejected: "text-rust",
  hired: "text-gold",
};

const SeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/applications/mine").then(({ data }) => setApplications(data.applications)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-700">Your Applications</h1>
          <p className="mt-1 text-slatewash">Track the status of every role you've applied to.</p>
        </div>
        <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
      </div>

      {loading && <p className="mt-8 text-slatewash">Loading...</p>}
      {!loading && applications.length === 0 && (
        <p className="mt-8 text-slatewash">You haven't applied to any jobs yet.</p>
      )}

      <div className="mt-8 space-y-3">
        {applications.map((app) => (
          <Link
            key={app._id}
            to={app.job ? `/jobs/${app.job._id}` : "#"}
            className="card flex items-center justify-between p-4 hover:border-gold"
          >
            <div>
              <h3 className="font-display text-lg font-600">{app.job?.title || "Job no longer available"}</h3>
              <p className="text-sm text-slatewash">{app.job?.company?.name} &middot; {app.job?.location}</p>
            </div>
            <span className={`text-sm font-semibold capitalize ${statusColor[app.status]}`}>{app.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SeekerDashboard;
