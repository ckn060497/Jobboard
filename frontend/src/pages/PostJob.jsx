import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const empty = {
  title: "",
  companyName: "",
  description: "",
  location: "",
  jobType: "full-time",
  category: "",
  experienceLevel: "entry",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  skills: "",
  requirements: "",
};

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        requirements: form.requirements.split("\n").map((r) => r.trim()).filter(Boolean),
      };
      const { data } = await api.post("/jobs", payload);
      navigate(`/jobs/${data.job._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-700">Post a Job</h1>
      <p className="mt-1 text-slatewash">Fill in the details below to publish a new listing.</p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <input required placeholder="Job title" className="input" value={form.title} onChange={handleChange("title")} />
          <input required placeholder="Company name" className="input" value={form.companyName} onChange={handleChange("companyName")} />
        </div>

        <textarea required rows={5} placeholder="Job description" className="input" value={form.description} onChange={handleChange("description")} />

        <div className="grid gap-4 sm:grid-cols-2">
          <input required placeholder="Location (e.g. Remote, New York, NY)" className="input" value={form.location} onChange={handleChange("location")} />
          <input placeholder="Category (e.g. Engineering)" className="input" value={form.category} onChange={handleChange("category")} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <select className="input" value={form.jobType} onChange={handleChange("jobType")}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
          <select className="input" value={form.experienceLevel} onChange={handleChange("experienceLevel")}>
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <input type="number" placeholder="Salary min" className="input" value={form.salaryMin} onChange={handleChange("salaryMin")} />
          <input type="number" placeholder="Salary max" className="input" value={form.salaryMax} onChange={handleChange("salaryMax")} />
          <input placeholder="Currency" className="input" value={form.currency} onChange={handleChange("currency")} />
        </div>

        <input placeholder="Skills, comma separated (e.g. React, Node.js)" className="input" value={form.skills} onChange={handleChange("skills")} />
        <textarea rows={3} placeholder="Requirements, one per line" className="input" value={form.requirements} onChange={handleChange("requirements")} />

        {error && <p className="text-sm text-rust">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Publishing..." : "Publish Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
