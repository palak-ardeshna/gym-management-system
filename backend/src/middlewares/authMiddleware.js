import { verifyToken } from "../utils/jwt.js";
import { unauthorized, forbidden } from "../utils/httpError.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(unauthorized("Authorization token is required"));
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    next(unauthorized("Invalid or expired token"));
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(forbidden("Access denied. Admin only."));
  }
};
