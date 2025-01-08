const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
// Get token from the header
    const authHeader = req.cookies.token || req.headers['authorization'].split(' ')[1];
    // console.log('Cookies:', req.cookies);

    if (!authHeader){
        return res.status(401).json({message: 'Authorization failed: No token provided'})
    }
    const token =  authHeader;
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