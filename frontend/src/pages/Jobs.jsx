import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import JobCard from "../components/JobCard.jsx";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    location: searchParams.get("location") || "",
    jobType: searchParams.get("jobType") || "",
    experienceLevel: searchParams.get("experienceLevel") || "",
  });

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    const params = { ...filters, page };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    try {
      const { data } = await api.get("/jobs", { params });
      setJobs(data.jobs);
      setMeta({ total: data.total, page: data.page, pages: data.pages });
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(filters);
    fetchJobs(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-700">Browse Jobs</h1>
      <p className="mt-1 text-slatewash">{meta.total} open role{meta.total === 1 ? "" : "s"} right now</p>

      <form onSubmit={handleSubmit} className="card mt-6 grid gap-3 p-4 sm:grid-cols-5">
        <input
          className="input sm:col-span-2"
          placeholder="Title, skill, or company"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />
        <input
          className="input"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <select
          className="input"
          value={filters.jobType}
          onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
        >
          <option value="">Any type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
        </select>
        <select
          className="input"
          value={filters.experienceLevel}
          onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
        >
          <option value="">Any level</option>
          <option value="entry">Entry</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
          <option value="lead">Lead</option>
        </select>
        <button type="submit" className="btn-primary sm:col-span-5">
          Apply Filters
        </button>
      </form>

      <div className="mt-8 grid gap-4">
        {loading && <p className="text-slatewash">Loading jobs...</p>}
        {!loading && jobs.length === 0 && (
          <p className="text-slatewash">No jobs match your search. Try broadening your filters.</p>
        )}
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      {meta.pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchJobs(p)}
              className={`h-9 w-9 rounded-md border text-sm ${
                p === meta.page ? "border-ink bg-ink text-paper" : "border-ink/15 hover:bg-ink/5"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
