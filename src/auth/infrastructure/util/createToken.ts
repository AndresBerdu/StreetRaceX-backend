import type { Token } from "../../domain/interfaces/Token.js";
import jwt from "jsonwebtoken";

export const generateToken = (user: Token) => {
  console.log(process.env.SECRET_KEY)
  return jwt.sign(user, process.env.SECRET_KEY!, { expiresIn: "1h" });
};

export const generateRefreshToken = (user: Token) => {
  return jwt.sign(user, process.env.SECRET_KEY!, { expiresIn: "7d" });
};
