import User from "../models/User.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    if (!adminEmails.length) {
      return res.status(403).json({ success: false, message: "Admin access not configured" });
    }

    const user = await User.findById(userId);
    if (!user || !adminEmails.includes(user.email)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
