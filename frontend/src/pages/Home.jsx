import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import JobCard from "../components/JobCard.jsx";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/jobs?limit=5").then(({ data }) => setJobs(data.jobs)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <div>
      <section className="border-b border-ink/10 bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:grid-cols-2 sm:items-center">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">No. 001 &middot; Job Listings</p>
            <h1 className="font-display text-4xl font-700 leading-tight sm:text-5xl">
              Forge your next role,<br />one listing at a time.
            </h1>
            <p className="mt-5 max-w-md text-paper/75">
              Foundry is a no-frills ledger of open roles from real employers.
              Search by title, skill, or location, and apply in minutes.
            </p>
            <form onSubmit={handleSearch} className="mt-8 flex max-w-md gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Try 'React developer' or 'Remote'"
                className="input flex-1"
              />
              <button type="submit" className="btn-primary bg-gold text-ink hover:bg-gold/80">
                Search
              </button>
            </form>
          </div>
          <div className="card overflow-hidden bg-paper text-ink">
            <div className="border-b border-ink/10 px-5 py-3 text-xs uppercase tracking-[0.2em] text-slatewash">
              Latest Postings
            </div>
            <ul className="divide-y divide-ink/10">
              {jobs.slice(0, 4).map((job, i) => (
                <li key={job._id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <span className="font-display text-rust">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 truncate">{job.title}</span>
                  <span className="text-slatewash">{job.company?.name}</span>
                </li>
              ))}
              {jobs.length === 0 && (
                <li className="px-5 py-6 text-sm text-slatewash">No jobs posted yet — be the first.</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-600">Open Roles</h2>
          <Link to="/jobs" className="text-sm font-semibold text-rust hover:underline">
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-600">For Job Seekers</h3>
            <p className="mt-2 text-sm text-slatewash">
              Build a profile, upload your resume once, and apply to roles in a couple clicks.
            </p>
            <Link to="/register" className="mt-3 inline-block text-sm font-semibold text-rust hover:underline">
              Create your profile &rarr;
            </Link>
          </div>
          <div>
            <h3 className="font-display text-lg font-600">For Employers</h3>
            <p className="mt-2 text-sm text-slatewash">
              Post a role, review applicants, and manage your hiring pipeline in one place.
            </p>
            <Link to="/register" className="mt-3 inline-block text-sm font-semibold text-rust hover:underline">
              Post a job &rarr;
            </Link>
          </div>
          <div>
            <h3 className="font-display text-lg font-600">Sign in fast</h3>
            <p className="mt-2 text-sm text-slatewash">
              Use email and password, or continue with Google — no extra forms to fill out.
            </p>
            <Link to="/login" className="mt-3 inline-block text-sm font-semibold text-rust hover:underline">
              Log in &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
