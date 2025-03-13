import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const authentication = (req, res, next) => {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return res.status(500).json({ message: "Server error: JWT secret missing" });
  }

  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.id = decoded.userId; 
    next()
  } 
  
  catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export { authentication };
