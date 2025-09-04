const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "Missing idToken" });

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload(); // safe, verified
    const email = payload.email;
    const name = payload.name || email?.split("@")[0] || "Google User";
    const googleId = payload.sub;
    const picture = payload.picture;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Option A (no schema change): store a random hashed placeholder password
      const placeholder = await bcrypt.hash(
        "google-oauth-" + Math.random().toString(36).slice(2),
        10
      );

      user = await User.create({
        name,
        email,
        password: placeholder, // not used for Google logins
        provider: "google",
        googleId,
        picture,
      });
    } else {
      // Keep profile fresh
      if (!user.googleId || user.name !== name || user.picture !== picture) {
        user.googleId = user.googleId || googleId;
        user.name = user.name || name;
        user.picture = user.picture || picture;
        user.provider = user.provider || "google";
        await user.save();
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error("googleAuth error:", err);
    return res.status(500).json({ message: "Google auth failed" });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hash });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      token,
      user: { name: newUser.name, email: newUser.email, id: newUser._id },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { name: user.name, email: user.email, id: user._id },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
