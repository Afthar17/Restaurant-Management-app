import jwt from "jsonwebtoken";
export const genToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true, //protection from XSS attacks
    sameSite: process.env.NODE_ENV === "development" ? "none" : "strict", //protection from CSRF attacks
    secure: process.env.NODE_ENV === "production", //protection from man-in-the-middle attacks
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
