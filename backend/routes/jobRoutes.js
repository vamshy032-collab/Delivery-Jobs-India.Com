const express = require("express");
const router = express.Router();
const { applyJob, getUserApplications, getAllApplications, checkApplied } = require("../controllers/jobController");

// POST /api/jobs/apply - Apply for a job
router.post("/apply", applyJob);

// GET /api/jobs/my-applications/:userId - Get user's applications
router.get("/my-applications/:userId", getUserApplications);

// GET /api/jobs/applications - Get all applications (admin)
router.get("/applications", getAllApplications);

// GET /api/jobs/check/:userId/:jobId - Check if user applied for a job
router.get("/check/:userId/:jobId", checkApplied);

module.exports = router;
