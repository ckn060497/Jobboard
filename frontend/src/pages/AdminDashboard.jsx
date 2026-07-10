import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState("users");

  const load = async () => {
    const [s, u, j] = await Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/users"),
      api.get("/admin/jobs"),
    ]);
    setStats(s.data);
    setUsers(u.data.users);
    setJobs(j.data.jobs);
  };

  useEffect(() => { load(); }, []);

  const toggleUser = async (id) => {
    const { data } = await api.put(`/admin/users/${id}/status`);
    setUsers(users.map((u) => (u._id === id ? data.user : u)));
  };

  const toggleJob = async (id) => {
    const { data } = await api.put(`/admin/jobs/${id}/approve`);
    setJobs(jobs.map((j) => (j._id === id ? data.job : j)));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl font-700">Admin Dashboard</h1>

      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-6">
          {[
            ["Users", stats.users],
            ["Seekers", stats.jobseekers],
            ["Employers", stats.employers],
            ["Jobs", stats.jobs],
            ["Open Jobs", stats.openJobs],
            ["Applications", stats.applications],
          ].map(([label, value]) => (
            <div key={label} className="card p-3 text-center">
              <p className="font-display text-2xl font-700">{value}</p>
              <p className="text-xs uppercase tracking-wide text-slatewash">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-2">
        <button onClick={() => setTab("users")} className={tab === "users" ? "btn-primary" : "btn-secondary"}>Users</button>
        <button onClick={() => setTab("jobs")} className={tab === "jobs" ? "btn-primary" : "btn-secondary"}>Jobs</button>
      </div>

      {tab === "users" && (
        <div className="mt-6 space-y-2">
          {users.map((u) => (
            <div key={u._id} className="card flex items-center justify-between p-3">
              <div>
                <p className="font-medium">{u.name} <span className="text-xs uppercase text-slatewash">({u.role})</span></p>
                <p className="text-sm text-slatewash">{u.email}</p>
              </div>
              <button onClick={() => toggleUser(u._id)} className="btn-secondary">
                {u.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "jobs" && (
        <div className="mt-6 space-y-2">
          {jobs.map((j) => (
            <div key={j._id} className="card flex items-center justify-between p-3">
              <div>
                <p className="font-medium">{j.title}</p>
                <p className="text-sm text-slatewash">{j.company?.name} &middot; {j.employer?.email}</p>
              </div>
              <button onClick={() => toggleJob(j._id)} className="btn-secondary">
                {j.isApproved ? "Unapprove" : "Approve"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
