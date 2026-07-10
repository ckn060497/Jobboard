import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(({ data }) => setJob(data.job)).catch(() => setJob(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!resumeFile) {
      setStatus({ type: "error", message: "Please attach a resume (PDF, DOC, or DOCX)." });
      return;
    }
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("coverLetter", coverLetter);
      await api.post(`/applications/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus({ type: "success", message: "Application submitted. Good luck!" });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Could not submit application." });
    } finally {
      setSubmitting(false);
    }
  };

  if (job === false) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-slatewash">Job not found.</div>;
  }
  if (!job) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-slatewash">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-rust">{job.company?.name}</p>
      <h1 className="mt-1 font-display text-3xl font-700">{job.title}</h1>
      <p className="mt-2 text-slatewash">
        {job.location} &middot; {job.jobType} &middot; {job.experienceLevel} level
        {job.salaryMin || job.salaryMax ? ` \u00B7 ${job.currency} ${job.salaryMin}\u2013${job.salaryMax}` : ""}
      </p>

      <div className="card mt-8 space-y-6 p-6">
        <section>
          <h2 className="font-display text-lg font-600">Description</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slatewash">{job.description}</p>
        </section>

        {job.requirements?.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-600">Requirements</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slatewash">
              {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </section>
        )}

        {job.skills?.length > 0 && (
          <section className="flex flex-wrap gap-2">
            {job.skills.map((s, i) => (
              <span key={i} className="rounded-full bg-ink/5 px-3 py-1 text-xs text-slatewash">{s}</span>
            ))}
          </section>
        )}
      </div>

      <div className="card mt-8 p-6">
        <h2 className="font-display text-lg font-600">Apply for this role</h2>

        {user?.role === "jobseeker" ? (
          <form onSubmit={handleApply} className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Resume (PDF, DOC, DOCX)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="input"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Cover letter (optional)</label>
              <textarea
                rows={4}
                className="input"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a fit..."
              />
            </div>
            {status.message && (
              <p className={status.type === "error" ? "text-sm text-rust" : "text-sm text-teal"}>
                {status.message}
              </p>
            )}
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        ) : user?.role === "employer" || user?.role === "admin" ? (
          <p className="mt-3 text-sm text-slatewash">Employer and admin accounts can't apply to jobs.</p>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-slatewash">Log in as a job seeker to apply.</p>
            <button onClick={() => navigate("/login")} className="btn-primary mt-3">Log In</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
