import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  FormHelperText,
  CircularProgress,
  Divider
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer1 from "../components/Footer1";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import huskyLogo from "../assets/HuskyLOGO.png"; // Make sure this path is correct
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("huskyUser");
    if (user) {
      const userData = JSON.parse(user);
      // Redirect based on role
      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else if (userData.role === "supervisor") {
        navigate("/supervisor-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Mark as touched and validate
    if (!touched[name]) {
      setTouched({ ...touched, [name]: true });
    }
    validateField(name, value);
    setLoginError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!value.endsWith("@northeastern.edu")) {
          error = "Only Northeastern email addresses are allowed";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;
        
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    const emailError = validateField("email", form.email);
    const passwordError = validateField("password", form.password);
    
    return !emailError && !passwordError;
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Mark all fields as touched
    setTouched({ email: true, password: true });
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await axios.post("http://localhost:5050/api/login", form);
      const { email, role } = res.data.user;
  
      // Save user in local storage
      localStorage.setItem("huskyUser", JSON.stringify({ email, role }));
  
      // Role-based redirect
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "supervisor") {
        navigate("/supervisor-dashboard");
      } else {
        navigate("/dashboard");
      }
  
    } catch (err) {
      setLoginError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box 
        sx={{ 
          backgroundImage: "linear-gradient(to bottom, #f7f7f7, #ffffff)",
          minHeight: "calc(100vh - 64px)",
          py: 4,
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Husky Logo Watermark - similar to Contact Us page */}
        <Box
          component="img"
          src={huskyLogo}
          alt="HuskyTracks watermark"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.025,
            zIndex: 0,
            maxWidth: "80%",
          }}
        />
        
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              border: "1px solid rgba(176, 0, 32, 0.1)"
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <SchoolIcon 
                sx={{ 
                  fontSize: 60, 
                  color: "#b00020",
                  mb: 2,
                  filter: "drop-shadow(0 2px 4px rgba(176, 0, 32, 0.3))"
                }} 
              />
              <Typography
                variant="h4"
                gutterBottom
                sx={{ 
                  color: "#b00020", 
                  fontWeight: "bold",
                  letterSpacing: "0.5px"
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#444", mb: 1 }}
              >
                Sign in using your Northeastern credentials
              </Typography>
            </Box>
            
            {loginError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  "& .MuiAlert-icon": { color: "#b00020" }
                }}
              >
                {loginError}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                placeholder="youremail@northeastern.edu"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color={touched.email && errors.email ? "error" : "action"} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color={touched.password && errors.password ? "error" : "action"} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: "#b00020",
                  color: "#fff",
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(176, 0, 32, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#900018",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(176, 0, 32, 0.4)",
                  },
                  "&:disabled": {
                    backgroundColor: "#d7a6ab",
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
              
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2" color="textSecondary">
                  Note: Use your Northeastern email address to login
                </Typography>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="textSecondary" paragraph>
                  First time user? Contact your administrator to create an account.
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  For technical support, contact support@huskytracks.northeastern.edu
                </Typography>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
      <Footer1 />
    </>
  );
};

export default Login;