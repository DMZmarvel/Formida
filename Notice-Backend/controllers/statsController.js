const User = require("../models/User");
const Notice = require("../models/Notice");

exports.getStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const noticesCount = await Notice.countDocuments();
    const companiesCount = await Notice.distinct("company").length; // example
    const adminsCount = await User.countDocuments({ role: "admin" });

    res.json({
      users: usersCount,
      notices: noticesCount,
      companies: companiesCount,
      admins: adminsCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
