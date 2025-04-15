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
  IconButton,
  FormHelperText,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import DashboardNavbar from "../components/DashboardNavbar";
import LocationPicker from "../components/LocationPicker";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Footer1 from "../components/Footer1";

// Predefined categories
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
    coordinates: null,
    image: null,
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({
    title: "",
    category: "",
    description: "",
    coordinates: "",
  });
  
  // Form touched state
  const [touched, setTouched] = useState({
    title: false,
    category: false,
    description: false,
    coordinates: false,
  });
  
  const [preview, setPreview] = useState(null);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("huskyUser"));

  useEffect(() => {
    // Redirect to login if not logged in
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle text input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({...prev, [name]: true}));
    }
    
    // Live validation
    validateField(name, value);
  };

  // Handle location selection
  const handleLocationSelect = (coordinates) => {
    setForm(prev => ({ ...prev, coordinates }));
    if (!touched.coordinates) {
      setTouched(prev => ({ ...prev, coordinates: true }));
    }
    validateField('coordinates', coordinates);
  };

  // Handle blur event for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({...prev, [name]: true}));
    validateField(name, value);
  };

  // Field validation function
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "title":
        if (!value.trim()) {
          error = "Title is required";
        } else if (value.trim().length < 3) {
          error = "Title must be at least 3 characters";
        }
        break;
        
      case "category":
        if (!value) {
          error = "Please select a category";
        }
        break;
        
      case "description":
        if (!value.trim()) {
          error = "Description is required";
        } else if (value.trim().length < 10) {
          error = "Please provide a more detailed description (at least 10 characters)";
        }
        break;
        
      case "coordinates":
        if (!value || !Array.isArray(value) || value.length !== 2) {
          error = "Please select a location on the map";
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prev => ({...prev, [name]: error}));
    return error;
  };

  // Validate all fields
  const validateForm = () => {
    let isValid = true;
    
    // Validate each field
    for (const field of ["title", "category", "description", "coordinates"]) {
      const error = validateField(field, form[field]);
      if (error) isValid = false;
    }
    
    return isValid;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image size and type
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Image size should be less than 5MB");
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setFormError("Only JPEG, JPG and PNG images are allowed");
        return;
      }
      
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
      setFormError("");
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    const newTouched = {};
    Object.keys(touched).forEach(key => { newTouched[key] = true });
    setTouched(newTouched);
    
    // Validate all fields
    if (!validateForm()) {
      setFormError("Please fix the errors in the form before submitting");
      return;
    }
    
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("coordinates", JSON.stringify(form.coordinates));
      
      // Append image if provided, otherwise backend will use default
      if (form.image) {
        formData.append("image", form.image);
      }
      
      formData.append("submittedBy", user.email);

      const res = await axios.post("http://localhost:5050/api/lost-items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Lost item reported successfully! You will be notified if someone finds it.");
      setForm({ title: "", category: "", description: "", coordinates: null, image: null });
      setPreview(null);
      
      // After 2 seconds, redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setFormError("Failed to submit lost item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DashboardNavbar role="student" />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Report Lost Item
        </Typography>

        {formError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formError}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Item Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                required
              />

              <FormControl error={touched.category && Boolean(errors.category)}>
                <InputLabel>Category *</InputLabel>
                <Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Category *"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                {touched.category && errors.category && (
                  <FormHelperText>{errors.category}</FormHelperText>
                )}
              </FormControl>

              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                rows={4}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                required
              />

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Select Location *
                </Typography>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialCoordinates={form.coordinates}
                />
                {touched.coordinates && errors.coordinates && (
                  <FormHelperText error>{errors.coordinates}</FormHelperText>
                )}
              </Box>

              <Box>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCameraIcon />}
                  >
                    Upload Image
                  </Button>
                </label>

                {preview && (
                  <Box sx={{ mt: 2, position: "relative", display: "inline-block" }}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "4px" }}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        backgroundColor: "white",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  backgroundColor: "#b00020",
                  "&:hover": { backgroundColor: "#900018" },
                  fontWeight: 600,
                }}
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
      <Footer1 />
    </>
  );
};

export default ReportLostItem;