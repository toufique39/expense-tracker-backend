
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

// Protect routes that require login
export const requireAuth = async (req, res, next) => {
  try {
    const sessionData = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    // No valid session
    if (!sessionData) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    // Attach authenticated user and session
    req.user = sessionData.user;
    req.session = sessionData.session;

    next();
  } catch (error) {
    next(error);
  }
};
