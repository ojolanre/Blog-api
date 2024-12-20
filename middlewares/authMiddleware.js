const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
// Get token from the header
    const authHeader = req.headers['authorization'];

    if (!authHeader){
        return res.status(401).json({message: 'Authorization failed'})
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    // Verify the token
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Add user from payload
    req.user = decoded;
    next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid', error: error.message});
    }
};

module.exports = authenticate;