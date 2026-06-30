const { verifyAccessToken } = require("../../shared/utils/jwt.js");
const userService = require("../../modules/user/services/user.service.js");

/**
 * Like authMiddleware but never blocks the request.
 * If a valid Bearer token is present, it attaches req.user.
 * If no token or an invalid token is present, it just calls next().
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme === "Bearer" && token) {
      const payload = verifyAccessToken(token);
      const user = await userService.findById(payload.sub);
      if (user) req.user = user;
    }
  } catch {
    // ignore errors — just proceed without user
  }
  return next();
};

module.exports = optionalAuthMiddleware;
