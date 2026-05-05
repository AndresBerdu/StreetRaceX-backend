import type { RefreshToken } from "../../domain/interfaces/RefreshToken.js";
import type { Token } from "../../domain/interfaces/Token.js";
import jwt from "jsonwebtoken";

export const generateToken = (user: Token) => {
  return jwt.sign(user, process.env.SECRET_KEY!, { expiresIn: "1h" });
};

export const generateRefreshToken = (user: RefreshToken) => {
  return jwt.sign(user, process.env.SECRET_KEY!, { expiresIn: "7d" });
};
