// const mongoose = require("mongoose");

// const noticeSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     type: { type: String, required: true }, // e.g. 'change-of-name'
//     fullName: String,
//     oldName: String,
//     newName: String,
//     content: String,
//     previewHtml: String,
//     status: { type: String, default: "pending" }, // 'pending', 'paid', 'published'
//     referenceId: { type: String, unique: true },
//     createdAt: { type: Date, default: Date.now },
//     paid: { type: Boolean, default: false },
//     newspaper: { type: String }, // e.g., Punch, Vanguard
//     price: { type: Number }, // for dynamic pricing
//     publishAt: { type: Date },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Notice", noticeSchema);

// models/Notice.js
const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    type: { type: String, required: true }, // e.g. 'change-of-name'
    fullName: { type: String },
    oldName: { type: String },
    newName: { type: String },
    content: { type: String },
    previewHtml: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    referenceId: { type: String, unique: true, index: true },
    paid: { type: Boolean, default: false, index: true },
    newspaper: { type: String },
    price: { type: Number },
    publishAt: { type: Date, index: true },
  },
  { timestamps: true }
);

// helpful text index for search
noticeSchema.index({
  fullName: "text",
  oldName: "text",
  newName: "text",
  type: "text",
  referenceId: "text",
});

module.exports = mongoose.model("Notice", noticeSchema);
