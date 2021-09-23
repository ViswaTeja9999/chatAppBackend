import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { protect } from "../middlewares/authMiddleware.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decodeToken.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Failed, not authorized.");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});
