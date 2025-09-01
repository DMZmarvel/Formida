// const express = require("express");
// const router = express.Router();

// const {
//   submitNotice,
//   getUserNotices,
//   getAllNotices,
//   getNoticeByRef,
//   rejectNotice,
//   approveNotice,
//   getMyNotices,
//   previewNotice,
//   getPublishedNotices,
// } = require("../controllers/noticeController");

// const { protect } = require("../middleware/authMiddleware");
// const Notice = require("../models/Notice");

// router.get("/my", protect, getUserNotices);
// router.get("/all", protect, getAllNotices);
// router.get("/preview/:ref", previewNotice);
// router.get("/my", protect, getMyNotices);
// router.put("/approve/:id", protect, approveNotice);
// router.put("/reject/:id", protect, rejectNotice);
// router.post("/submit", protect, submitNotice);
// router.get("/status/:ref", getNoticeByRef); // public
// router.get("/published", getPublishedNotices);

// router.post('/payment-success', async (req, res) => {
//   const { referenceId, transactionRef } = req.body;

//   try {
//     const notice = await Notice.findOne({ referenceId });
//     if (!notice) return res.status(404).json({ error: 'Notice not found' });

//     notice.paid = true;
//     notice.status = 'Approved'; // or keep current if already handled
//     await notice.save();

//     res.json({ success: true });
//   } catch (err) {
//     console.error('Payment verification failed:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.patch("/mark-paid/:ref", async (req, res) => {
//   try {
//     const notice = await Notice.findOneAndUpdate(
//       { referenceId: req.params.ref },
//       {
//         paid: true,
//         publishAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
//       },
//       { new: true }
//     );

//     if (!notice) {
//       return res.status(404).json({ message: "Notice not found" });
//     }

//     res.json({ message: "Marked as paid", notice });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error updating notice", error: err.message });
//   }
// });

// module.exports = router;

// routes/noticeRoutes.js
const express = require("express");
const router = express.Router();

const {
  submitNotice,
  getUserNotices,
  getAllNotices,
  getNoticeByRef,
  rejectNotice,
  approveNotice,
  previewNotice,
  getPublishedNotices,
} = require("../controllers/noticeController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const Notice = require("../models/Notice");

// user routes
router.post("/submit", protect, submitNotice);
router.get("/my", protect, getUserNotices);
router.get("/status/:ref", getNoticeByRef); // public
router.get("/preview/:ref", previewNotice);
router.get("/published", getPublishedNotices);

// admin routes
router.get("/all", protect, adminOnly, getAllNotices);
router.put("/approve/:id", protect, adminOnly, approveNotice);
router.put("/reject/:id", protect, adminOnly, rejectNotice);

// routes/noticeRoutes.js
router.post("/payment-success", async (req, res) => {
  const { referenceId, transactionRef } = req.body;

  try {
    const notice = await Notice.findOne({ referenceId });
    if (!notice) return res.status(404).json({ error: "Notice not found" });

    notice.paid = true;
    notice.status = "approved"; // 🔧 lowercase to match filters
    if (!notice.publishAt) {
      // schedule 5 days ahead (or make this "new Date()" if you want immediate)
      notice.publishAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    }
    await notice.save();

    res.json({ success: true, notice });
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// optional manual mark-paid (keep lowercase + schedule)
router.patch("/mark-paid/:ref", async (req, res) => {
  try {
    const notice = await Notice.findOneAndUpdate(
      { referenceId: req.params.ref },
      {
        paid: true,
        status: "approved",
        publishAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      { new: true }
    );

    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.json({ message: "Marked as paid", notice });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating notice", error: err.message });
  }
});

module.exports = router;
