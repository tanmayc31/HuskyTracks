import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Paper,
  Alert,
  Stack,
  IconButton
} from "@mui/material";
import DashboardNavbar from "../components/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import Footer1 from "../components/Footer1";

const locations = [
  "Snell Library",
  "Curry Student Center",
  "ISEC",
  "Egan Research Center",
  "Ryder Hall",
];

const categories = [
  "Electronics",
  "Books & Notes",
  "Clothing & Accessories",
  "Keys & ID Cards",
  "Water Bottles & Containers",
  "Other"
];

const ReportLostItem = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    locationName: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = JSON.parse(localStorage.getItem("huskyUser"));

  useEffect(() => {
    // Redirect to login if not logged in
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

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

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.locationName || !form.image) {
      return setError("Please fill in all required fields and upload an image.");
    }

    if (!form.category) {
      return setError("Please select a category for the lost item.");
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("locationName", form.locationName);
      formData.append("image", form.image);
      formData.append("submittedBy", user.email);

      const res = await axios.post("http://localhost:5050/api/lost-items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Lost item reported successfully! You will be notified if someone finds it.");
      setForm({ title: "", category: "", description: "", locationName: "", image: null });
      setPreview(null);
      
      // After 2 seconds, redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Failed to submit lost item. Please try again.");
    }
  };

  return (
    <>
      <DashboardNavbar role="student" />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 6 }}>
        <Paper
          elevation={4}
          sx={{
            p: 5,
            borderRadius: 4,
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#b00020",
              fontWeight: "bold",
              mb: 3,
              textAlign: "center",
            }}
          >
            Report Lost Item
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Item Title"
                name="title"
                fullWidth
                variant="outlined"
                value={form.title}
                onChange={handleChange}
                required
              />
              
              <TextField
                select
                label="Category"
                name="category"
                fullWidth
                value={form.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Please describe your item in detail (color, brand, any distinctive features, etc.)"
              />
              
              <TextField
                select
                label="Last Seen Location"
                name="locationName"
                fullWidth
                value={form.locationName}
                onChange={handleChange}
                required
              >
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </TextField>

              <Box>
                <Button
                  component="label"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#b00020",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.2
                  }}
                >
                  {preview ? "Change Image" : "Upload Image"}
                  <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                </Button>
                {preview && (
                  <Box mt={2} position="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ borderRadius: "10px", width: "100%", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover": { backgroundColor: "#ffcccc" },
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <Stack direction="row" spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#b00020",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    flex: 1,
                    py: 1.2
                  }}
                >
                  Submit Report
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    borderColor: "#b00020",
                    color: "#b00020",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    flex: 1,
                    "&:hover": {
                      backgroundColor: "#ffe5e5",
                      borderColor: "#b00020",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Container>
      <Footer1 />
    </>
  );
};

export default ReportLostItem;