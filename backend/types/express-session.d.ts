import { Session } from "express-session";

declare module "express-session" {
  interface Session {
    isAdmin?: boolean;
    destroy(callback: (err?: any) => void): void;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    session: Session;
  }
}
