import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";

const StudentDashboard = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("huskyUser"));

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5050/api/lost-items?email=${user.email}`
        );
        setItems(res.data);
      } catch (err) {
        console.error("Failed to load items", err);
      }
    };

    if (user?.email) fetchItems();
  }, [user]);

  const handleReportClick = () => {
    navigate("/report-lost-item");
  };

  return (
    <>
      <DashboardNavbar role="student" />
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography
          variant="h4"
          sx={{ mb: 2, fontWeight: "bold", color: "#b00020" }}
        >
          Welcome, {user.email}
        </Typography>

        <Button
          variant="contained"
          sx={{ mb: 4, backgroundColor: "#b00020" }}
          onClick={handleReportClick}
        >
          Report a Lost Item
        </Button>

        <Typography variant="h5" sx={{ mb: 2 }}>
          Your Lost Item Reports
        </Typography>

        <Grid container spacing={3}>
          {items.length === 0 ? (
            <Typography variant="body1" sx={{ color: "#666", pl: 2 }}>
              You haven't reported any lost items yet.
            </Typography>
          ) : (
            items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card sx={{ height: "100%" }}>
                  {item.imageUrl && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={item.imageUrl}
                      alt="Lost Item"
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      📍 {item.locationName}
                    </Typography>
                    <Chip
                      label={item.status}
                      color={
                        item.status === "Returned"
                          ? "success"
                          : item.status === "Matched"
                          ? "warning"
                          : "default"
                      }
                      sx={{ mt: 2 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </>
  );
};

export default StudentDashboard;
