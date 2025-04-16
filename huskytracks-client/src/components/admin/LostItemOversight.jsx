import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  CircularProgress,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const LostItemOversight = () => {
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/admin/all-lost-items");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load lost items", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesLocation = locationFilter === "All" || item.locationName === locationFilter;
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesLocation && matchesSearch;
  });

  const uniqueLocations = [
    "All",
    ...new Set(items.map((item) => item.locationName).filter(Boolean))
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        All Lost Item Reports
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <TextField
          select
          label="Status"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Matched">Matched</MenuItem>
          <MenuItem value="Returned">Returned</MenuItem>
          <MenuItem value="Transferred to NUPD">Transferred to NUPD</MenuItem>
        </TextField>

        <TextField
          select
          label="Location"
          size="small"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          {uniqueLocations.map((loc) => (
            <MenuItem key={loc} value={loc}>{loc}</MenuItem>
          ))}
        </TextField>

        <TextField
          placeholder="Search title or description"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: 250 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress color="error" />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Submitted By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.locationName}</TableCell>
                  <TableCell>{item.submittedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default LostItemOversight;
