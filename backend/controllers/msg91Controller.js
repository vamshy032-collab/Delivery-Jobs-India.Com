require("dotenv").config();

// MSG91 Configuration
const MSG91_API_KEY = process.env.MSG91_API_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID || "DELJOBOTP";
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID || "DLVJOB";
const MSG91_BASE_URL = "https://api.msg91.com/api/v5/otp";

// In-memory OTP store
const otpStore = new Map();

// ==========================================
// POST /api/msg91/send-otp - Send OTP via MSG91
// ==========================================
const sendOTP = async (req, res) => {
  try {
    const { mobile, userId, purpose } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required"
      });
    }

    // Validate mobile (Indian format)
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number"
      });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const fullMobile = "91" + mobile;

    // Store OTP with expiry (5 minutes)
    const otpData = {
      otp,
      mobile,
      userId,
      purpose: purpose || "login",
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000
    };
    
    otpStore.set(mobile, otpData);

    // Send via MSG91 if API key is configured
    if (MSG91_API_KEY) {
      try {
        const response = await fetch(MSG91_BASE_URL, {
          method: "POST",
          headers: {
            "authkey": MSG91_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            mobile: fullMobile,
            otp: otp,
            template_id: MSG91_TEMPLATE_ID,
            sender: MSG91_SENDER_ID,
            verify_otp: true
          })
        });

        const result = await response.json();
        
        console.log("MSG91 Response:", result);
        
        if (result.type === "success" || response.ok) {
          return res.status(200).json({
            success: true,
            message: "OTP sent successfully to " + mobile,
            request_id: result.request_id
          });
        } else {
          return res.status(400).json({
            success: false,
            message: result.message || "Failed to send OTP"
          });
        }
      } catch (apiError) {
        console.error("MSG91 API Error:", apiError);
        // Fall through to demo mode
      }
    }

    // Demo mode
    console.log(`📱 OTP for ${mobile}: ${otp}`);
    
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully (Demo Mode)",
      demo_mode: true,
      otp: otp
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==========================================
// POST /api/msg91/verify-otp - Verify OTP
// ==========================================
const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile and OTP are required"
      });
    }

    // Get stored OTP
    const storedData = otpStore.get(mobile);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new OTP."
      });
    }

    // Check expiry
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(mobile);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP."
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Delete OTP after successful verification
    otpStore.delete(mobile);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      verified: true
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};
