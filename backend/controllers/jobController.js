const supabase = require("../config/database");

// ==========================================
// POST /api/jobs/apply - Apply for a job
// ==========================================
const applyJob = async (req, res) => {
  try {
    const { user_id, job_id, company_name, job_title, location, salary } = req.body;

    if (!user_id || !job_id) {
      return res.status(400).json({
        success: false,
        message: "user_id and job_id are required"
      });
    }

    // Check if already applied
    const { data: existing } = await supabase
      .from("job_applications")
      .select("id")
      .eq("user_id", user_id)
      .eq("job_id", job_id)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    // Insert application
    const { data, error } = await supabase
      .from("job_applications")
      .insert([
        {
          user_id,
          job_id,
          company_name: company_name || null,
          job_title: job_title || null,
          location: location || null,
          salary: salary || null,
          status: "Applied",
          applied_date: new Date().toISOString().split("T")[0],
          applied_time: new Date().toTimeString().split(" ")[0]
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
      message: "Application submitted successfully",
      application: data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==========================================
// GET /api/jobs/my-applications/:userId - Get user's applications
// ==========================================
const getUserApplications = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      applications: data,
      count: data.length
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==========================================
// GET /api/jobs/applications - Get all applications (admin)
// ==========================================
const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("job_applications")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      applications: data,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
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
// GET /api/jobs/check/:userId/:jobId - Check if user applied
// ==========================================
const checkApplied = async (req, res) => {
  try {
    const { userId, jobId } = req.params;

    const { data, error } = await supabase
      .from("job_applications")
      .select("id")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .single();

    res.status(200).json({
      success: true,
      applied: !!data,
      application: data || null
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  applyJob,
  getUserApplications,
  getAllApplications,
  checkApplied
};
