import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import ReportLostItem from "./pages/ReportLostItem";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";
import Navbar from "./components/Navbar";
import Footer1 from "./components/Footer1";

// Layout for pages with shared Navbar/Footer
const PublicPageLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer1 />
  </>
);

function App() {
  return (
    <div className="w-full overflow-x-hidden">
      <Router>
        <Routes>
          {/* Public routes (no auth) */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Public pages with navbar/footer */}
          <Route path="/about-us" element={<PublicPageLayout><AboutUs /></PublicPageLayout>} />
          <Route path="/contact-us" element={<PublicPageLayout><ContactUs /></PublicPageLayout>} />

          {/* Smart redirection based on user role */}
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* Protected student-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/report-lost-item" element={<ReportLostItem />} />
          </Route>

          {/* Protected admin-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Protected supervisor-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["supervisor"]} />}>
            <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
