import jwt from "jsonwebtoken";

interface Location {
  locality_zone: string;
  city_zone: string;
  state_zone: string;
  country_zone: string;
}

interface UserToken {
  username: string;
  password: string;
  email?: string;
  profile_photo?: string;
  location?: Location;
}

export const generateToken = (user: UserToken) => {
  return jwt.sign(user, process.env.SECRET_KEY!, { expiresIn: "1h" });
};

export const generateRefreshToken = (user: UserToken) => {
  return jwt.sign(user, process.env.SECRET_KEY!, { expiresIn: "7d" });
};
