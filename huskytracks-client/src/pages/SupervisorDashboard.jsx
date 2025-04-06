import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";

const SupervisorDashboard = () => {
  const [reports, setReports] = useState([]);
  const user = JSON.parse(localStorage.getItem("huskyUser"));
  const assignedLocation = "Snell Library"; // 🔒 You can make this dynamic later

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5050/api/lost-items/supervisor?location=${assignedLocation}`
        );
        setReports(res.data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };

    fetchReports();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5050/api/lost-items/${id}`, { status });
      setReports((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <>
      <DashboardNavbar role="supervisor" />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ color: "#b00020", fontWeight: "bold", mb: 2 }}>
          Supervisor Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Viewing lost item reports for <strong>{assignedLocation}</strong>
        </Typography>

        <Grid container spacing={3}>
          {reports.map((item) => (
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
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    👤 {item.submittedBy}
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

                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    {item.status === "Pending" && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="warning"
                        onClick={() => handleStatusUpdate(item._id, "Matched")}
                      >
                        Mark as Matched
                      </Button>
                    )}
                    {item.status !== "Returned" && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="success"
                        onClick={() => handleStatusUpdate(item._id, "Returned")}
                      >
                        Mark as Returned
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default SupervisorDashboard;
