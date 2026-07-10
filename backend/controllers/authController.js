const supabase = require("../config/database");

// ==========================================
// POST /api/auth/signup - Register new user
// ==========================================
const signup = async (req, res) => {
  try {
    const { full_name, email, mobile_number, password } = req.body;

    if (!full_name || !mobile_number) {
      return res.status(400).json({
        success: false,
        message: "full_name and mobile_number are required"
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("mobile_number", mobile_number)
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this mobile number already exists"
      });
    }

    // Create new user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          full_name,
          email: email || null,
          mobile_number,
          password: password || null,
          login_type: "PHONE",
          is_verified: true,
          last_login: new Date().toISOString()
        }
      ])
      .select()
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
      user: {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        mobile_number: data.mobile_number
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==========================================
// POST /api/auth/login - Login user
// ==========================================
const login = async (req, res) => {
  try {
    const { mobile_number } = req.body;

    if (!mobile_number) {
      return res.status(400).json({
        success: false,
        message: "mobile_number is required"
      });
    }

    // Find user
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("mobile_number", mobile_number)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update last login
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", data.id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        mobile_number: data.mobile_number,
        is_verified: data.is_verified
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==========================================
// GET /api/auth/user/:id - Get user by ID
// ==========================================
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, mobile_number, is_verified, last_login, created_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==========================================
// PUT /api/auth/user/:id - Update user
// ==========================================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({ full_name, email })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
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
  signup,
  login,
  getUser,
  updateUser
};
