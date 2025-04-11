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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Footer1 from "../components/Footer1";

// Predefined locations
const locations = [
  "Snell Library",
  "Curry Student Center",
  "ISEC",
  "Egan Research Center",
  "Ryder Hall",
  "Other"
];

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
    locationName: "",
    otherLocation: "",
    image: null,
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({
    title: "",
    category: "",
    description: "",
    locationName: "",
    otherLocation: ""
  });
  
  // Form touched state
  const [touched, setTouched] = useState({
    title: false,
    category: false,
    description: false,
    locationName: false,
    otherLocation: false
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
        
      case "locationName":
        if (!value) {
          error = "Please select a location";
        }
        break;
        
      case "otherLocation":
        if (form.locationName === "Other" && !value.trim()) {
          error = "Please specify the location";
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
    for (const field of ["title", "category", "description", "locationName"]) {
      const error = validateField(field, form[field]);
      if (error) isValid = false;
    }
    
    // Validate "Other" location if selected
    if (form.locationName === "Other") {
      const error = validateField("otherLocation", form.otherLocation);
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
      
      // Handle location - use otherLocation if "Other" is selected
      if (form.locationName === "Other") {
        formData.append("locationName", form.otherLocation);
      } else {
        formData.append("locationName", form.locationName);
      }
      
      // Append image if provided, otherwise backend will use default
      if (form.image) {
        formData.append("image", form.image);
      }
      
      formData.append("submittedBy", user.email);

      const res = await axios.post("http://localhost:5050/api/lost-items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Lost item reported successfully! You will be notified if someone finds it.");
      setForm({ title: "", category: "", description: "", locationName: "", otherLocation: "", image: null });
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
              {/* Title Field with validation */}
              <TextField
                label="Item Title *"
                name="title"
                fullWidth
                variant="outlined"
                value={form.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                inputProps={{ maxLength: 50 }}
              />
              
              {/* Category Field with validation */}
              <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
                <InputLabel id="category-label">Category *</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={form.category}
                  label="Category *"
                  onChange={handleChange}
                  onBlur={handleBlur}
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
              
              {/* Description Field with validation */}
              <TextField
                label="Description *"
                name="description"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={form.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={
                  (touched.description && errors.description) || 
                  "Please describe your item in detail (color, brand, any distinctive features, etc.)"
                }
                inputProps={{ maxLength: 500 }}
              />
              
              {/* Location Field with validation */}
              <FormControl fullWidth error={touched.locationName && Boolean(errors.locationName)}>
                <InputLabel id="location-label">Last Seen Location *</InputLabel>
                <Select
                  labelId="location-label"
                  id="locationName"
                  name="locationName"
                  value={form.locationName}
                  label="Last Seen Location *"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
                {touched.locationName && errors.locationName && (
                  <FormHelperText>{errors.locationName}</FormHelperText>
                )}
              </FormControl>
              
              {/* Other Location Field (conditionally displayed) */}
              {form.locationName === "Other" && (
                <TextField
                  label="Specify Location *"
                  name="otherLocation"
                  fullWidth
                  variant="outlined"
                  value={form.otherLocation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.otherLocation && Boolean(errors.otherLocation)}
                  helperText={touched.otherLocation && errors.otherLocation}
                />
              )}

              {/* Image Upload (Optional) */}
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Image (Optional) - If not provided, a default image will be used
                </Typography>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<PhotoCameraIcon />}
                  fullWidth
                  sx={{
                    backgroundColor: preview ? "#4caf50" : "#b00020",
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

              {formError && <Alert severity="error">{formError}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <Stack direction="row" spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{
                    backgroundColor: "#b00020",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    flex: 1,
                    py: 1.2
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Report"}
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