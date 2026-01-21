import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // attach decoded admin object
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRoles = (...roles) => {
  return (req, res, next) => {
    const admin = req.admin;

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ok = admin.roles && admin.roles.some((r) => roles.includes(r));
    if (!ok) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
