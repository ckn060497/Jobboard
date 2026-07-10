import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";

const statusOptions = ["applied", "reviewed", "shortlisted", "rejected", "hired"];

const statusColor = {
  applied: "text-slatewash",
  reviewed: "text-ink",
  shortlisted: "text-teal",
  rejected: "text-rust",
  hired: "text-gold",
};

const JobApplicants = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/applications/job/${id}`).then(({ data }) => setApplications(data.applications)).finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (appId, status) => {
    const { data } = await api.put(`/applications/${appId}/status`, { status });
    setApplications(applications.map((a) => (a._id === appId ? data.application : a)));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/employer/dashboard" className="text-sm text-slatewash hover:text-rust">&larr; Back to dashboard</Link>
      <h1 className="mt-2 font-display text-3xl font-700">Applicants</h1>

      {loading && <p className="mt-6 text-slatewash">Loading...</p>}
      {!loading && applications.length === 0 && (
        <p className="mt-6 text-slatewash">No applicants yet for this role.</p>
      )}

      <div className="mt-6 space-y-3">
        {applications.map((app) => (
          <div key={app._id} className="card p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-lg font-600">{app.applicant?.name}</h3>
                <p className="text-sm text-slatewash">{app.applicant?.email}</p>
                {app.applicant?.headline && <p className="text-sm text-slatewash">{app.applicant.headline}</p>}
              </div>
              <div className="flex items-center gap-3">
                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-rust hover:underline">
                  View Resume
                </a>
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  className={`input w-auto capitalize ${statusColor[app.status]}`}
                >
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {app.coverLetter && (
              <p className="mt-3 whitespace-pre-line border-t border-ink/10 pt-3 text-sm text-slatewash">{app.coverLetter}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobApplicants;
