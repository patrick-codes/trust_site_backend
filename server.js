const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth_routes");
const profileRoutes = require("./routes/profileRoutes");
const beneficiaryRoute = require("./routes/beneficiary_route");
const connectDB = require("./confiq/dbconfiq");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "https://trust-site-backend.onrender.com",
      "https://smartlucatrust.com",
      "https://www.smartlucatrust.com",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoutes);
app.use("/api", beneficiaryRoute);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
