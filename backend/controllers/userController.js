const supabase = require("../config/database");

const signup = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required"
      });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          phone,
          login_type: "PHONE",
          is_verified: false
        }
      ])
      .select("id, phone, email, login_type, is_verified, created_at, last_login")
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  signup
};
