const express = require("express");
const router = express.Router();
const { signup, login, getUser, updateUser } = require("../controllers/authController");

// POST /api/auth/signup - Register new user
router.post("/signup", signup);

// POST /api/auth/login - Login user
router.post("/login", login);

// GET /api/auth/user/:id - Get user by ID
router.get("/user/:id", getUser);

// PUT /api/auth/user/:id - Update user
router.put("/user/:id", updateUser);

module.exports = router;
