// controllers/noticeController.js
const Notice = require("../models/Notice");
const generateRef = require("../utils/generateRef");

exports.submitNotice = async (req, res) => {
  try {
    const { type, fullName, oldName, newName, content, price } = req.body;
    const userId = req.user.id;

    // generate unique reference with retry on collision
    let referenceId;
    for (let i = 0; i < 5; i++) {
      referenceId = generateRef();
      const exists = await Notice.exists({ referenceId });
      if (!exists) break;
      if (i === 4) throw new Error("Could not allocate unique referenceId");
    }

    const notice = await Notice.create({
      user: userId,
      type,
      fullName,
      oldName,
      newName,
      content,
      price,
      referenceId,
      status: "pending",
      paid: false,
    });

    res.status(201).json(notice);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Notice submission failed", error: err.message });
  }
};

exports.getNoticeByRef = async (req, res) => {
  try {
    const notice = await Notice.findOne({ referenceId: req.params.ref });
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.json(notice);
  } catch {
    res.status(500).json({ message: "Error fetching notice" });
  }
};

exports.getUserNotices = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const q = { user: req.user.id };
    const notices = await Notice.find(q)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);
    const total = await Notice.countDocuments(q);
    res.json({ data: notices, page: +page, limit: +limit, total });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not fetch notices", error: err.message });
  }
};

exports.getAllNotices = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = "" } = req.query;
    const filter = search ? { $text: { $search: search } } : {};
    const notices = await Notice.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);
    const total = await Notice.countDocuments(filter);
    res.json({ data: notices, page: +page, limit: +limit, total });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch notices", error: err.message });
  }
};

exports.approveNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    notice.status = "approved"; // lowercase
    // Optionally schedule publication in X days if not set by payment verifier
    if (!notice.publishAt)
      notice.publishAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    await notice.save();

    res.json({ message: "Notice approved", notice });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve", error: err.message });
  }
};

exports.rejectNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    notice.status = "rejected"; // lowercase
    await notice.save();

    res.json({ message: "Notice rejected", notice });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject", error: err.message });
  }
};

exports.previewNotice = async (req, res) => {
  try {
    const notice = await Notice.findOne({
      referenceId: req.params.ref,
    }).populate("user", "name email");
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.json(notice);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching notice", error: err.message });
  }
};
// controllers/noticeController.js
exports.getPublishedNotices = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 30,
      scope = "confirmed", // 🔧 default to show ALL confirmed (past+present)
      sortBy = "publishAt",
      order = "desc",
    } = req.query;

    // Base: only paid + approved
    const base = {
      paid: true,
      status: "approved",
    };

    // Scope rules
    const filter = { ...base };
    if (scope === "published") {
      filter.publishAt = { $lte: new Date() };
    }
    // scope === "confirmed" -> no publishAt filter (shows past + future)

    // Search
    if (search) {
      const rx = new RegExp(search, "i");
      filter.$or = [
        { fullName: rx },
        { oldName: rx },
        { newName: rx },
        { referenceId: rx },
        { type: rx },
        { newspaper: rx },
      ];
    }

    // Sorting
    const sortField = ["publishAt", "createdAt", "price"].includes(sortBy)
      ? sortBy
      : "publishAt";
    const sortDir = order === "asc" ? 1 : -1;
    const sort = { [sortField]: sortDir, _id: -1 }; // stable secondary sort

    const notices = await Notice.find(filter)
      .sort(sort)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Notice.countDocuments(filter);

    res.json({ data: notices, page: +page, limit: +limit, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch published notices" });
  }
};
