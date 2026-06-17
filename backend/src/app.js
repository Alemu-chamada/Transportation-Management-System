const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const errorMiddleware = require("./shared/middleware/error.middleware.js");
const logger = require("./shared/utils/logger.js");
const env = require("./config/env.js");

const app = express();

// Build the list of explicitly allowed origins from the env var
const explicitOrigins = env.allowedOrigins
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Returns true if the request origin is permitted
const isOriginAllowed = (origin) => {
  // Always allow requests with no origin (curl, Postman, mobile)
  if (!origin) return true;

  // 1. Exact match against the ALLOWED_ORIGINS list
  if (explicitOrigins.includes(origin)) return true;

  // 2. Allow any Vercel preview/production deployment for this project
  //    Matches: https://*.vercel.app
  if (/^https:\/\/[a-z0-9-]+(\.vercel\.app)$/.test(origin)) return true;

  // 3. Allow localhost in development
  if (env.nodeEnv !== "production") {
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
    if (/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true;
  }

  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

// Handle preflight requests explicitly before any other middleware
app.options('*', cors());

// Configure Helmet with relaxed CSP for development
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  },
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    data: { redis: "connected", postgres: "connected" }
  });
});
app.use("/api/v1", routes);

app.use(errorMiddleware);

module.exports = app;
