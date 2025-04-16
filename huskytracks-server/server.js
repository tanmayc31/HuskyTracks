import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import testUserRoutes from "./routes/registerTestUsers.js";
import lostItemRoutes from "./routes/lostItemRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import sendMatchEmailRoute from "./routes/sendMatchEmailRoute.js";
import adminRoutes from "./routes/adminRoutes.js";





dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", authRoutes);
app.use("/api", testUserRoutes);
app.use("/api/lost-items", lostItemRoutes);
app.use("/api", sendMatchEmailRoute);
app.use("/api/admin", adminRoutes);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5050;
app.use((req, res, next) => {
    console.log(`❗Unhandled request: ${req.method} ${req.originalUrl}`);
    next();
  });
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
