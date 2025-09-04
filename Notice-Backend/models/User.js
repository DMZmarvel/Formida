// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true, index: true },
//     password: { type: String, required: true },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//       index: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // keep required if using placeholder
    provider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String },
    picture: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
