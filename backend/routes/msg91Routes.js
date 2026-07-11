const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP } = require("../controllers/msg91Controller");

// POST /api/msg91/send-otp - Send OTP via MSG91
router.post("/send-otp", sendOTP);

// POST /api/msg91/verify-otp - Verify OTP
router.post("/verify-otp", verifyOTP);

module.exports = router;
