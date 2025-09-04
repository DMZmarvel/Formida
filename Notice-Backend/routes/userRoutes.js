const express = require("express");
const {
  register,
  login,
  googleAuth,
} = require("../controllers/userController");

const router = express.Router();

router.post("/google", googleAuth); // 👈

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

module.exports = router;
