const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        // Retrieve the token from cookies
        const token = req.cookies?.token;

        console.log("Token:", token);

        // Check if the token is present
        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Please login.",
                error: true,
                success: false,
            });
        }

        // Verify the token
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(403).json({
                    message: "Invalid or expired token. Please login again.",
                    error: true,
                    success: false,
                });
            }

            console.log("Decoded Token:", decoded);

            // Attach the user ID to the request object for further use
            req.userId = decoded._id;

            // Proceed to the next middleware or route handler
            next();
        });
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        res.status(500).json({
            message: err.message || "Internal server error.",
            error: true,
            success: false,
        });
    }
}

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed' })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId // Make sure this is set
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' })
  }
}

module.exports = authToken;
