import jwt from "jsonwebtoken";


export const generateCookie = (res, user, expiresIn = 7 * 24 * 60 * 60) => {
  // Generate JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn,
  });

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expiresIn * 1000, // convert seconds to milliseconds
  });

  return token; // optional
};
