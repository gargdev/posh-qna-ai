"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAdminAuthenticated = void 0;
const ensureAdminAuthenticated = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        next();
        return;
    }
    res.status(401).json({ error: "Unauthorized" });
};
exports.ensureAdminAuthenticated = ensureAdminAuthenticated;
