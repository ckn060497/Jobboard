import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    skills: user?.skills?.join(", ") || "",
    companyName: user?.company?.name || "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      headline: form.headline,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (user.role === "employer") payload.company = { ...user.company, name: form.companyName };

    const { data } = await api.put("/auth/profile", payload);
    setUser(data.user);
    setMessage("Profile updated.");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-3xl font-700">Your Profile</h1>
      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
        <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        {user?.role === "jobseeker" && (
          <>
            <input className="input" placeholder="Headline (e.g. Frontend Developer)" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
            <input className="input" placeholder="Skills, comma separated" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          </>
        )}

        {user?.role === "employer" && (
          <input className="input" placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        )}

        {message && <p className="text-sm text-teal">{message}</p>}
        <button type="submit" className="btn-primary w-full">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;
