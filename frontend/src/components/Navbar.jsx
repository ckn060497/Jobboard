import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const dashboardPath = {
  jobseeker: "/seeker/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-ink/10 bg-paper/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-700 tracking-tight">Foundry</span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-slatewash sm:inline">
            Find work that fits
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link to="/jobs" className="hover:text-rust">Browse Jobs</Link>

          {!user && (
            <>
              <Link to="/login" className="hover:text-rust">Log In</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}

          {user && (
            <>
              <Link to={dashboardPath[user.role]} className="hover:text-rust">
                Dashboard
              </Link>
              <span className="hidden text-slatewash sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="btn-secondary">Log Out</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
