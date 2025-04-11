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
import Navbar from "./components/Navbar";
import Footer1 from "./components/Footer1";

// Layout component for pages that need navbar and footer but aren't the landing page
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
          {/* Public Routes that handle their own navbar/footer */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
          </Route>
          
          {/* Public Routes with navbar/footer added */}
          <Route path="/about-us" element={
            <PublicPageLayout>
              <AboutUs />
            </PublicPageLayout>
          } />
          
          <Route path="/contact-us" element={
            <PublicPageLayout>
              <ContactUs />
            </PublicPageLayout>
          } />
          
          {/* Protected Routes - Any logged-in user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/report-lost-item" element={<ReportLostItem />} />
          </Route>
          
          {/* Protected Routes - Admin only */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>
          
          {/* Protected Routes - Supervisor only */}
          <Route element={<ProtectedRoute allowedRoles={['supervisor']} />}>
            <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;