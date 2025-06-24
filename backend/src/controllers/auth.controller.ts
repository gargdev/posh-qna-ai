import { Request, Response, NextFunction } from "express";
import passport from "passport";
// import bcrypt from "bcryptjs";
// import { User } from "../models/user";

export const localLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message });

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({
        user: {
          displayName: user.displayName,
          email: user.email,
          isSubscribed: user.isSubscribed,
          chatCredits: user.chatCredits,
        },
      });
    });
  })(req, res, next);
};

export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  // save where to go after login
  if (req.query.redirect) {
    (req.session as any).returnTo = req.query.redirect;
  }

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    // force account selection & re-consent:
    prompt: 'select_account consent',
    accessType: 'offline',            // if you need refresh tokens
  })(req, res, next);
};

export const googleCallback = passport.authenticate("google", {
  failureRedirect: "/login",
  session: true,
});

export const googleRedirect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // pull the returnTo off session if present
  const redirect =
    (req.session as any).returnTo ||
    process.env.CLIENT_URL! ||
    "http://localhost:5173";

  // clear it so it doesn’t hang around
  delete (req.session as any).returnTo;

  res.redirect(redirect);
};

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (req.user) {
      res.json({ user: req.user });
    } else {
      res.json({ user: null });
    }
  } catch (err) {
    next(err);
  }
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
};
