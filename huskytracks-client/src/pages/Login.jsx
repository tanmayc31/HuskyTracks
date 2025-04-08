import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Paper,
} from "@mui/material";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.email.endsWith("@northeastern.edu")) {
      setError("Only Northeastern email addresses are allowed.");
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:5050/api/login", form);
      const { email, role } = res.data.user;
  
      // Save user in local storage
      localStorage.setItem("huskyUser", JSON.stringify({ email, role }));
  
      // Role-based redirect
      if (role === "admin") {
        window.location.href = "/admin-dashboard";
      } else if (role === "supervisor") {
        window.location.href = "/supervisor-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
  
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
              

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#b00020", fontWeight: "bold" }}
        >
          HuskyTracks Login
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ color: "#444", mb: 2 }}
        >
          Log in using your Northeastern email to report or recover lost items.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ backgroundColor: "#b00020", color: "#fff" }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
