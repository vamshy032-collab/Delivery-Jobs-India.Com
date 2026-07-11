const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const jobRoutes = require("./routes/jobRoutes");
const msg91Routes = require("./routes/msg91Routes");

const app = express();

// ================================
// Middleware
// ================================
app.use(cors());
app.use(express.json());

// ================================
// Routes
// ================================
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/msg91", msg91Routes);

// ================================
// Test Routes
// ================================
app.get("/api/users/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ User Route Working Successfully"
  });
});

app.get("/api/auth/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Auth Route Working Successfully"
  });
});

app.get("/api/visitors/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Visitor Route Working Successfully"
  });
});

app.get("/api/jobs/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Job Route Working Successfully"
  });
});

app.get("/api/msg91/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ MSG91 Route Working Successfully"
  });
});

// ================================
// Home Route
// ================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Delivery Jobs India Backend Running Successfully",
    endpoints: {
      auth: "/api/auth",
      visitors: "/api/visitors",
      jobs: "/api/jobs"
    }
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