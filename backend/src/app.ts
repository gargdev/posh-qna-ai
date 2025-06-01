import dotenv from "dotenv";
console.log("⚙️ Loading environment variables...");
dotenv.config();

import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ErrorRequestHandler,
} from "express";
const session = require("express-session");
import passport from "passport";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import crypto from "crypto";
import routes from "./routes/index";

console.log("🚀 Initializing Express application...");
export const app = express();

// Security Configurations
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5173",
  // Add your production domains here
];

// CORS Configuration
console.log("🔒 Setting up enhanced CORS middleware...");
app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, success?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-API-Key",
    ],
    exposedHeaders: ["Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
  }),
);
console.log("✅ Enhanced CORS configured");

// Security Headers with Helmet
console.log("🛡️ Setting up Helmet security headers...");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
  }),
);
console.log("✅ Helmet security headers configured");

// Request Logging
console.log("📝 Setting up Morgan request logging...");
app.use(morgan("dev"));
console.log("✅ Morgan logging configured");

// Body Parser Configuration
console.log("📦 Setting up enhanced JSON parser middleware...");
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
console.log("✅ Enhanced JSON parser configured");

// Session Configuration
console.log("🔐 Setting up session middleware...");
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "strict",
    },
  }),
);
console.log("✅ Session middleware configured");

// Initialize Passport
console.log("🔑 Setting up Passport authentication...");
app.use(passport.initialize());
app.use(passport.session());
console.log("✅ Passport authentication configured");

// Global Cache Control
const cacheControlMiddleware: RequestHandler = (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private",
  );
  next();
};

// Request Logging Middleware
const requestLoggingMiddleware: RequestHandler = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`📥 ${req.method} ${req.url}`);
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    if (!req.url.includes("/upload")) {
      // Skip logging body for file uploads
      console.log("Body:", JSON.stringify(req.body, null, 2));
    }
  }
  next();
};

// API Routes
console.log("🛣️ Mounting API routes...");
app.use("/api", routes);
console.log("✅ API routes mounted");

// Health Check Endpoint
console.log("🏥 Setting up health check endpoint...");
const healthCheckHandler: RequestHandler = (_req, res) => {
  console.log("💓 Health check requested");
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
  console.log("✅ Health check response sent");
};

// Error Handling Middleware
console.log("❌ Setting up error handling middleware...");
const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("❌ Error:", err);
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
};

app.use(cacheControlMiddleware);
app.use(requestLoggingMiddleware);
app.get("/api/health", healthCheckHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("\n🌈 Environment configuration:");
  console.log(`   - NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(
    `   - HF_API_TOKEN: ${process.env.HF_API_TOKEN ? "✅ Set" : "❌ Not set"}`,
  );
  console.log(
    `   - SESSION_SECRET: ${process.env.SESSION_SECRET ? "✅ Set" : "⚠️ Using fallback"}`,
  );

  console.log(
    `\n🚀 Server is running in ${process.env.NODE_ENV || "development"} mode`,
  );
  console.log(`   - Health check: http://localhost:${PORT}/api/health`);
  console.log(`   - API base URL: http://localhost:${PORT}/api`);
});

export default app;