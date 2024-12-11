import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// General JWT Authentication Middleware
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Please login again.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]); // Retrieve user info

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found. Please login again.' });
        }

        req.user = { id: user.id, role: user.role }; // Attach user data to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token. Please login again.' });
    }
};

// Admin Role Verification Middleware
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access forbidden: Admins only.' });
    }
    next(); // Allow the request to proceed if user is an admin
};

export { authMiddleware, adminMiddleware };
