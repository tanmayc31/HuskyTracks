import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import DashboardNavbar from "../components/DashboardNavbar";
import axios from "axios";

const locations = [
  "Snell Library",
  "Curry Student Center",
  "ISEC",
  "Egan Research Center",
  "Ryder Hall",
];

const ReportLostItem = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    locationName: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = JSON.parse(localStorage.getItem("huskyUser"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.locationName || !form.image) {
      return setError("Please fill in all fields and upload an image.");
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("locationName", form.locationName);
      formData.append("image", form.image);
      formData.append("submittedBy", user.email);

      const res = await axios.post("http://localhost:5050/api/lost-items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Lost item reported successfully!");
      setForm({ title: "", description: "", locationName: "", image: null });
      setPreview(null);
    } catch (err) {
      setError("Failed to submit lost item. Try again.");
    }
  };

  return (
    <>
      <DashboardNavbar role="student" />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" sx={{ color: "#b00020", fontWeight: "bold", mb: 2 }}>
            Report Lost Item
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Item Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={form.description}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              fullWidth
              label="Location"
              name="locationName"
              value={form.locationName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ mb: 2 }}>
              <Button variant="contained" component="label" sx={{ backgroundColor: "#b00020" }}>
                Upload Image
                <input hidden type="file" accept="image/*" onChange={handleImageChange} />
              </Button>
              {preview && (
                <Box mt={2}>
                  <img src={preview} alt="Preview" width="100%" style={{ borderRadius: "8px" }} />
                </Box>
              )}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#b00020" }}>
              Submit Report
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default ReportLostItem;
