const jwt = require('jsonwebtoken');

/**
 * Admin Authentication Middleware
 * This is the "Guard" that protects all admin routes.
 */
const adminAuth = (req, res, next) => {
    try {
        // 1. Get the token from the Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                error: 'No authentication token found. Access denied.' 
            });
        }

        // 2. Verify the token using your JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add the decoded user data (id, email, role) to the request object
        req.user = decoded;

        // 3. THE LOGIC: Role-Based Access Control (RBAC)
        // We check if the user's role in the token is 'admin' or 'kitchen_owner'
        // If they are a regular 'customer', we block them here.
        if (req.user.role !== 'admin' && req.user.role !== 'kitchen_owner') {
            return res.status(403).json({ 
                success: false, 
                error: 'Access denied. You do not have permission to perform admin actions.' 
            });
        }

        // 4. If everything is correct, move to the actual Admin Controller
        next();
    } catch (err) {
        console.error('Admin Auth Middleware Error:', err.message);
        res.status(401).json({ 
            success: false, 
            error: 'Session expired or invalid token. Please login again.' 
        });
    }
};

module.exports = adminAuth;