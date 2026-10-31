import { findOrCreateAuthenticatedUser } from "../utils/authUser.js";
import { getActivePunishment } from "../services/punishmentService.js";

export const protect = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        req.dbUser = await findOrCreateAuthenticatedUser(userId);
        const punishment = await getActivePunishment(userId);
        if (punishment) {
            req.punishment = punishment;
            if (["banned", "suspended"].includes(punishment.action)) {
                return res.status(403).json({ success: false, code: "ACCOUNT_RESTRICTED", message: "Conta temporariamente suspensa ou banida" });
            }
        }
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const requireContentPostingAccess = (req, res, next) => {
    if (req.punishment?.action === "restriction") {
        return res.status(403).json({ success: false, code: "POSTING_RESTRICTED", message: "Publicação temporariamente restrita" });
    }
    next();
};
