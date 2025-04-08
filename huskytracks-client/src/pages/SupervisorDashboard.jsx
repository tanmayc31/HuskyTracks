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
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";

const SupervisorDashboard = () => {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const user = JSON.parse(localStorage.getItem("huskyUser"));
  const assignedLocation = user?.location || "Snell Library";

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
  }, [assignedLocation]);

  const handleStatusUpdate = async (id, status) => {
    if (
      status === "Transferred to NUPD" &&
      !window.confirm("Are you sure you want to transfer this item to NUPD?")
    ) {
      return;
    }

    try {
      await axios.patch(`http://localhost:5050/api/lost-items/${id}`, { status });
      setReports((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Filter logic
  const filteredReports =
    statusFilter === "All"
      ? reports
      : reports.filter((item) => item.status === statusFilter);

  return (
    <>
      <DashboardNavbar role="supervisor" />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ color: "#b00020", fontWeight: "bold", mb: 2 }}>
          Supervisor Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Viewing reports for <strong>{assignedLocation}</strong>
        </Typography>

        <Tabs
          value={statusFilter}
          onChange={(e, newValue) => setStatusFilter(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 4 }}
        >
          <Tab label="All" value="All" />
          <Tab label="Pending" value="Pending" />
          <Tab label="Matched" value="Matched" />
          <Tab label="Returned" value="Returned" />
          <Tab label="Transferred to NUPD" value="Transferred to NUPD" />
        </Tabs>

        <Grid container spacing={3}>
          {filteredReports.map((item) => (
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
        : item.status === "Transferred to NUPD"
        ? "error"
        : "default"
    }
    sx={{ mt: 2 }}
  />

  <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
    <Button
      variant="outlined"
      size="small"
      color="warning"
      onClick={() => handleStatusUpdate(item._id, "Matched")}
    >
      Mark as Matched
    </Button>
    <Button
      variant="outlined"
      size="small"
      color="success"
      onClick={() => handleStatusUpdate(item._id, "Returned")}
    >
      Mark as Returned
    </Button>
    <Button
      variant="outlined"
      size="small"
      color="error"
      onClick={() => handleStatusUpdate(item._id, "Transferred to NUPD")}
    >
      Transfer to NUPD
    </Button>
  </Box>

  {/* ✅ Send Email button (only if item is Matched) */}
  {item.status === "Matched" && (
    <Button
      variant="contained"
      color="primary"
      size="small"
      sx={{ mt: 2 }}
      onClick={async () => {
        try {
          await axios.post("http://localhost:5050/api/send-match-email", {
            to: item.submittedBy,
            itemTitle: item.title,
            locationName: item.locationName,
            supervisorName: user.email.split("@")[0],
            supervisorEmail: user.email,
          });
          alert("📧 Email sent to student successfully!");
        } catch (err) {
          alert("❌ Failed to send email");
          console.error(err);
        }
      }}
    >
      Send Email to Student
    </Button>
  )}
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
