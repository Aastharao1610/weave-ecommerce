import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }
  console.log(req.headers);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden - Invalid token" });
  }
};
