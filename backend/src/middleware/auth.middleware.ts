import { Request, Response, NextFunction, RequestHandler } from "express";

export const ensureAdminAuthenticated: RequestHandler = (
  req,
  res,
  next,
): void => {
  if (req.session && req.session.isAdmin) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
};
