const supabase = require("../config/database");

// ==========================================
// POST /api/visitors - Track a new visitor
// ==========================================
const trackVisitor = async (req, res) => {
  try {
    const { full_name, visited_page, user_agent, referrer } = req.body;

    if (!visited_page) {
      return res.status(400).json({
        success: false,
        message: "visited_page is required"
      });
    }

    const { data, error } = await supabase
      .from("visitors")
      .insert([
        {
          full_name: full_name || "Anonymous Visitor",
          visited_page,
          referrer: referrer || "direct",
          visit_date: new Date().toISOString().split("T")[0],
          visit_time: new Date().toTimeString().split(" ")[0]
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
      message: "Visitor tracked successfully",
      visitor: data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==========================================
// GET /api/visitors - Get all visitors
// ==========================================
const getVisitors = async (req, res) => {
  try {
    const { page = 1, limit = 20, page_name } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("visitors")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (page_name) {
      query = query.eq("visited_page", page_name);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      visitors: data,
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
// GET /api/visitors/stats - Get visitor statistics
// ==========================================
const getVisitorStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("visitors")
      .select("visited_page, visit_date");

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Calculate stats
    const totalVisitors = data.length;
    const pageCounts = {};
    const dailyCounts = {};

    data.forEach(visitor => {
      // Count by page
      pageCounts[visitor.visited_page] = (pageCounts[visitor.visited_page] || 0) + 1;
      
      // Count by date
      const date = visitor.visit_date;
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalVisitors,
        byPage: pageCounts,
        byDate: dailyCounts
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  trackVisitor,
  getVisitors,
  getVisitorStats
};
