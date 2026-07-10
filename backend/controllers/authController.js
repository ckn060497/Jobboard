import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc   Register a new user
// @route  POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const allowedRoles = ["jobseeker", "employer"];
    const finalRole = allowedRoles.includes(role) ? role : "jobseeker";

    const user = await User.create({ name, email, password, role: finalRole });

    res.status(201).json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Login with email and password
// @route  POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "This account has been deactivated" });
    }

    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get currently logged-in user
// @route  GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc   Handle successful Google OAuth login, issue JWT, redirect to client
// @route  GET /api/auth/google/callback
export const googleCallback = async (req, res) => {
  const token = generateToken(req.user._id);
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  res.redirect(`${clientUrl}/oauth-success?token=${token}`);
};

// @desc   Update own profile
// @route  PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const updatable = ["name", "headline", "skills", "company"];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });
    await req.user.save();
    res.json({ user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};
