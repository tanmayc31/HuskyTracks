// src/components/admin/AnalyticsDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/admin/analytics");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress color="error" />
      </Box>
    );
  }

  // Datasets
  const statusData = {
    labels: data.byStatus.map((s) => s._id),
    datasets: [
      {
        label: "Items",
        data: data.byStatus.map((s) => s.count),
        backgroundColor: COLORS,
      },
    ],
  };

  const roleData = {
    labels: data.usersByRole.map((r) => r.role),
    datasets: [
      {
        label: "Users",
        data: data.usersByRole.map((r) => r.count),
        backgroundColor: COLORS,
      },
    ],
  };

  const weeklyData = {
    labels: data.weeklyTrends.map((d) => d.date),
    datasets: [
      {
        label: "Items Added",
        data: data.weeklyTrends.map((d) => d.count),
        borderColor: "#ef4444",
        backgroundColor: "#fecaca",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const locationData = {
    labels: data.byLocation.map((l) => l._id),
    datasets: [
      {
        label: "Lost Items",
        data: data.byLocation.map((l) => l.count),
        backgroundColor: COLORS,
      },
    ],
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>
        📊 Platform Analytics
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={6}>
          <Bar data={statusData} options={{ plugins: { legend: { display: false } } }} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Pie data={roleData} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Line data={weeklyData} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Bar data={locationData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;