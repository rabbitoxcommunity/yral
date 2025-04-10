const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from cookie
  const token = req.cookies['x-auth-token'];

  if (!token) {
    // Check if it's an API request or a browser request
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // For API requests, return JSON response
      return res.status(401).json({ message: 'No token, authorization denied' });
    } else {
      // For browser requests, redirect to login page
      return res.redirect('/admin/login');
    }
  }

  try {
    const decoded = jwt.verify(token, 'BIRTHSTORY_SECRET');
    req.admin = decoded.id;
    next();
  } catch (error) {
    // Check if it's an API request or a browser request
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // For API requests, return JSON response
      return res.status(401).json({ message: 'Token is not valid' });
    } else {
      // For browser requests, redirect to login page
      return res.redirect('/admin/login');
    }
  }
};