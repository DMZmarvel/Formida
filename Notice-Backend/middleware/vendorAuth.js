import jwt from "jsonwebtoken";

export const vendorAuth = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "vendor")
      return res.status(401).json({ message: "Invalid token type" });

    req.vendor = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
