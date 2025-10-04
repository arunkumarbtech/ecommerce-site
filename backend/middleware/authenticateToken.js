import jwt from "jsonwebtoken";

const { verify } = jwt;

//token authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.sendStatus(401);
        }
        console.log("Decoded JWT payload:", user);
        req.user = user;
        next();
    });
};

export default  authenticateToken;