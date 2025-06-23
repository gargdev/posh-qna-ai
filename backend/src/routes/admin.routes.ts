// routes/admin.routes.ts
import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import csurf from "csurf";
import crypto from "crypto";

const router = express.Router();

// 1) CSRF protection for login/logout
const csrfProtection = csurf({ cookie: false });

// NEW: let the client grab a fresh CSRF token
console.log("🔗 Setting up /admin/csrf to issue a CSRF token");
router.get(
  '/csrf',
  csrfProtection,
  (req, res) => {
    // csurf has generated a token and stored it in the session
    res.json({ csrfToken: (req as any).csrfToken() });
  }
);

// 2) Rate limiter to slow down brute-force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,                  // limit each IP to 10 login attempts per window
  message: { error: "Too many login attempts, please try again later." },
});

console.log("🔗 Setting up /admin/check route to verify admin session");
router.get(
  "/check",
  (req: Request, res: Response) => {
    const isAdmin = Boolean((req.session as any).isAdmin);
    res.json({ authenticated: isAdmin });
  }
);

console.log("🔗 Setting up /admin/login route for secure admin authentication");
router.post(
  "/login",
  loginLimiter,
  csrfProtection,
  (req: Request, res: Response): void => {
    const { email, password } = req.body;

    // 3) Timing-safe email & password compare
    const envEmail = process.env.ADMIN_EMAIL || "";
    const envPassHash = process.env.ADMIN_PASSWORD_HASH || ""; // store a SHA-256 hash in your .env
    const providedHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const emailMatches = crypto.timingSafeEqual(
      Buffer.from(email),
      Buffer.from(envEmail)
    );
    const passMatches = crypto.timingSafeEqual(
      Buffer.from(providedHash),
      Buffer.from(envPassHash)
    );

    if (emailMatches && passMatches) {
      req.session.isAdmin = true;
      // return new CSRF token for subsequent mutations
      const newToken = (req as any).csrfToken();
       res.json({ success: true, csrfToken: newToken });
    }

 res.status(401).json({ error: "Invalid credentials" });
  }
);

console.log("🔗 Setting up /admin/logout route to clear admin session");
router.post(
  "/logout",
  csrfProtection,
  (req: Request, res: Response) => {
    req.session.destroy(err => {
      if (err) {
        console.error("❌ Session destroy error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      // clear cookie named in your app.ts (defaults to 'connect.sid')
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      res.json({ success: true });
    });
  }
);

export default router;
