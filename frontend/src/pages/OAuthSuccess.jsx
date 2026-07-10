import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const dashboardPath = {
  jobseeker: "/seeker/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
};

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loginWithToken(token)
      .then((user) => navigate(dashboardPath[user.role] || "/"))
      .catch(() => navigate("/login"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center text-slatewash">
      Signing you in...
    </div>
  );
};

export default OAuthSuccess;
