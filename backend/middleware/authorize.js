// middleware/authorize.js
const authorize = (requiredPermissions = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const userPermissions = req.user.permissions || [];

        const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));

        if (!hasPermission) {
            return res.status(403).json({ error: "Access denied" });
        }

        next();
    };
};

export default authorize
