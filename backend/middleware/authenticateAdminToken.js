import jwt from "jsonwebtoken";

const authenticateAdminToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT verification failed:", err.message);
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        req.user = decoded;
        next();
    });
};

export default authenticateAdminToken;
