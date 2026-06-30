const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/database");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ================================
// Middleware
// ================================
app.use(cors());
app.use(express.json());

// ================================
// User Routes
// ================================
app.use("/api/users", userRoutes);

// ================================
// Test User Route
// ================================
app.get("/api/users/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ User Route Working Successfully"
  });
});

// ================================
// Home Route
// ================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Delivery Jobs India Backend Running Successfully"
  });
});

// ================================
// Database Connection Test
// ================================
app.get("/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "✅ Supabase Connected Successfully",
      data
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ================================
// Server Start
// ================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});