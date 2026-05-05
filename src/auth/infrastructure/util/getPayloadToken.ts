import jwt, { type JwtPayload } from "jsonwebtoken";

export const getPayloadToken = (token: string): JwtPayload | null => {
  const payload = jwt.decode(token);
  if (payload && typeof payload !== "string") {
    return payload as JwtPayload;
  }
  return null;
};
