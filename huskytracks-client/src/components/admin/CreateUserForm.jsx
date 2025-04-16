import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress
} from "@mui/material";
import axios from "axios";

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "supervisor",
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const locations = [
    "Snell Library",
    "Curry Student Center",
    "ISEC",
    "Marino Center",
    "Ryder Hall",
    "Richards Hall",
    "Egan Research Center",
    "West Village H",
    "Shillman Hall"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5050/api/admin/create-user", formData);
      setSuccess("User created successfully!");
      setFormData({ email: "", password: "", role: "supervisor", location: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Create New User
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <MenuItem value="supervisor">Supervisor</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          {formData.role === "supervisor" && (
            <TextField
              select
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>{loc}</MenuItem>
              ))}
            </TextField>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ width: "fit-content" }}
          >
            {loading ? <CircularProgress size={24} /> : "Create User"}
          </Button>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </form>
    </Paper>
  );
};

export default CreateUserForm;
