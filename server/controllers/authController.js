const User = require("../models/user");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, bracuId, email, password } = req.body; // role from client is ignored

    // Basic presence check
    if (!name || !bracuId || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // BRACU ID must be 8 digits
    if (!/^\d{8}$/.test(bracuId)) {
      return res.status(400).json({ message: "BRACU ID must be 8 digits" });
    }

    // Optional: password minimum length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // Decide role based on email domain
    let role;
    if (email.endsWith("@g.bracu.ac.bd")) {
      role = "student";
    } else if (email.endsWith("@bracu.ac.bd")) {
      role = "faculty";
    } else {
      return res
        .status(400)
        .json({ message: "Use your official BRACU email address" });
    }

    // Uniqueness checks
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingId = await User.findOne({ bracuId });
    if (existingId) {
      return res.status(400).json({ message: "BRACU ID already registered" });
    }

    // Create user (password hashed in pre-save hook)
    const user = await User.create({
      name,
      bracuId,
      email,
      password,
      role, // only student or faculty here
      // isClubAdmin defaults to false from schema
    });

    // Do NOT auto-login after register; just confirm creation
    return res.status(201).json({
      message: "Account created successfully. Please log in.",
      user: {
        id: user._id,
        name: user.name,
        bracuId: user.bracuId,
        email: user.email,
        role: user.role,
        isClubAdmin: user.isClubAdmin,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Block inactive users
    if (!user.isActive) {
      return res
        .status(401)
        .json({ message: "Account is inactive. Contact admin." });
    }

    // Role check: student cannot login as admin etc.
    if (user.role !== role) {
      return res
        .status(403)
        .json({ message: "Role mismatch. Access not allowed." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(res, user._id, user.role);

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        bracuId: user.bracuId,
        email: user.email,
        role: user.role,
        isClubAdmin: user.isClubAdmin,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/logout
const logoutUser = (req, res) => {
  // Clear JWT cookie in a safe way
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
  });
  return res.json({ message: "Logged out successfully" });
};

// GET /api/auth/me
const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const user = req.user;
  return res.json({
    id: user._id,
    name: user.name,
    bracuId: user.bracuId,
    email: user.email,
    role: user.role,
    isClubAdmin: user.isClubAdmin,
  });
};

module.exports = { registerUser, loginUser, logoutUser, getMe };
