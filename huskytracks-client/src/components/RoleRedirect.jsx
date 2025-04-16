// src/components/RoleRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RoleRedirect = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("huskyUser"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "admin") {
      navigate("/admin-dashboard");
    } else if (user.role === "supervisor") {
      navigate("/supervisor-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  }, [navigate, user]);

  return null;
};

export default RoleRedirect;
