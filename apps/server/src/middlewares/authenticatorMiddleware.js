import jwt from "jsonwebtoken";
import { rtnRes } from "../utils/helper.js";
import { env } from "#config/env.js";
import { queryRunner } from "#config/db.js";
/**
 * Middleware to protect routes - Verify JWT and attach user to request
 */
export const protect = async (req, res, next) => {
  let token;
  console.log("from protect")
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      // Get token from header
      token = authHeader.split(" ")[1];

      if (!token) {
        console.warn("Auth Middleware: Bearer header present but token missing");
        return rtnRes(res, 401, "Not authorized, token missing from Bearer header");
      }

      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET );

      // Get user from the token
      const users = await queryRunner(`
                        select * from users where id = ?`
                    , [decoded.id])
      req.user = (users && users.length > 0) ? users[0] : null;

      if (!req.user) {
        console.warn(`Auth Middleware: User not found for ID ${decoded.id}`);
        return rtnRes(res, 401, "Not authorized, user not found");
      }

      next();
    } catch (error) {
      console.error(`Auth Middleware Error for ${req.originalUrl}:`, error.message);
      
      const errorMessage = error.name === "TokenExpiredError" 
        ? "Not authorized, token expired" 
        : "Not authorized, token failed";
        
      return rtnRes(res, 401, errorMessage);
    }
  }

  if (!token) {
    console.warn(`Auth Middleware: No token provided for ${req.originalUrl}`);
    return rtnRes(res, 401, "Not authorized, no token provided");
  }
};


export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return rtnRes(
        res,
        403,
        `User role ${req.user.role} is not authorized to access this route`
      );
    }
    next();
  };
};

export const checkActivated = (req, res, next) => {
    if (req.user.role === 'ADMIN') return next(); // Admins always have access
    
    if (!req.user.is_active || req.user.activation_status !== 'ACTIVATED') {
        return rtnRes(res, 403, "Your account is not activated. Please complete registration and make purchase.");
    }
    next();
};
