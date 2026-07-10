import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const dashboardPath = {
  jobseeker: "/seeker/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(dashboardPath[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-700">Welcome back</h1>
      <p className="mt-1 text-slatewash">Log in to continue to Foundry.</p>

      <a
        href="/api/auth/google"
        className="btn-secondary mt-6 w-full"
      >
        Continue with Google
      </a>

      <div className="my-6 flex items-center gap-3 text-xs uppercase text-slatewash">
        <span className="h-px flex-1 bg-ink/10" /> or <span className="h-px flex-1 bg-ink/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Password"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-sm text-rust">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slatewash">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-rust hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
