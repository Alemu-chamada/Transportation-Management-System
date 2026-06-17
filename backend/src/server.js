const http = require("http");
const app = require("./app.js");
const { connectDb } = require("./infrastructure/database/db.js");
const env = require("./config/env.js");
const logger = require("./shared/utils/logger.js");
const { initializeTrackingSocket } = require("./infrastructure/socket/tracking.socket.js");

// Startup environment check — warn loudly about missing critical vars
const checkEnv = () => {
  const warnings = [];

  if (!process.env.BREVO_API_KEY) {
    warnings.push("⚠️  BREVO_API_KEY is not set — email/OTP delivery will fail.");
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "change_me_in_production") {
    warnings.push("⚠️  JWT_SECRET is not set or is using the default — authentication is insecure.");
  }
  if (!process.env.PGPASSWORD) {
    warnings.push("⚠️  PGPASSWORD is not set — database connection may fail.");
  }

  if (warnings.length > 0) {
    console.warn("\n════════════════════════════════════════");
    console.warn("  MISSING ENVIRONMENT VARIABLES");
    warnings.forEach((w) => console.warn(" ", w));
    console.warn("════════════════════════════════════════\n");
  }
};

// Start the server
const start = async () => {
  try {
    checkEnv();
    await connectDb();

    const server = http.createServer(app);
    initializeTrackingSocket(server);

    server.listen(env.port, () => {
      logger.info(`Server is running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    logger.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

start();

