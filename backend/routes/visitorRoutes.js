const express = require("express");
const router = express.Router();
const { trackVisitor, getVisitors, getVisitorStats } = require("../controllers/visitorController");

// POST /api/visitors - Track a new visitor
router.post("/", trackVisitor);

// GET /api/visitors - Get all visitors (admin)
router.get("/", getVisitors);

// GET /api/visitors/stats - Get visitor statistics
router.get("/stats", getVisitorStats);

module.exports = router;
