import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const dashboardPath = {
  jobseeker: "/seeker/dashboard",
  employer: "/employer/dashboard",
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "jobseeker" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(form);
      navigate(dashboardPath[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-700">Create your account</h1>
      <p className="mt-1 text-slatewash">Join Foundry as a job seeker or employer.</p>

      <a href="/api/auth/google" className="btn-secondary mt-6 w-full">
        Continue with Google
      </a>

      <div className="my-6 flex items-center gap-3 text-xs uppercase text-slatewash">
        <span className="h-px flex-1 bg-ink/10" /> or <span className="h-px flex-1 bg-ink/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {["jobseeker", "employer"].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setForm({ ...form, role: r })}
              className={`rounded-md border px-3 py-2 text-sm font-medium capitalize ${
                form.role === r ? "border-ink bg-ink text-paper" : "border-ink/15 text-slatewash"
              }`}
            >
              {r === "jobseeker" ? "Job Seeker" : "Employer"}
            </button>
          ))}
        </div>
        <input
          required
          placeholder="Full name"
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          required
          placeholder="Email"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password (min 6 characters)"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-sm text-rust">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slatewash">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-rust hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
