import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Protected route component that checks if user is logged in
const ProtectedRoute = ({ allowedRoles = [] }) => {
  // Get the user from localStorage
  const userJSON = localStorage.getItem('huskyUser');
  const user = userJSON ? JSON.parse(userJSON) : null;
  
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified and user's role doesn't match, redirect to dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If user is logged in and role is allowed (or no roles specified), render the component
  return <Outlet />;
};

// Public route component that redirects to dashboard if user is already logged in
const PublicRoute = () => {
  const userJSON = localStorage.getItem('huskyUser');
  const user = userJSON ? JSON.parse(userJSON) : null;
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise, render the component
  return <Outlet />;
};

export { ProtectedRoute, PublicRoute };