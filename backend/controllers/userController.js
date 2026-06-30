const supabase = require("../config/database");
console.log("✅ NEW USER CONTROLLER LOADED");
const signup = async (req, res) => {
console.log("Signup API Called");
 console.log(req.body);
try {
    const { full_name, email, phone, password } = req.body;

    // Validation
    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Insert into users table
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          full_name,
          email,
          phone,
          password_hash: password
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: "User Registered Successfully ✅",
      user: data[0]
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