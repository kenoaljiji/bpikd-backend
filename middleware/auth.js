// Import jwt using ES6 module syntax
import jwt from 'jsonwebtoken';

// Assuming you have an errorHandler function defined somewhere that handles errors
// You might need to adjust this part according to your actual errorHandler implementation
import { errorHandler } from './response-handler.js';

export const verifyToken = (req, res, next) => {
  // Get the token from the header if present
  let token = req.headers.authorization;

  // If no token found, use the errorHandler to return an unauthorized response
  if (!token) {
    return errorHandler(res, 401, 'Unauthorized: No token provided.');
  }

  try {
    // Extract the token if it comes as "Bearer <token>"
    if (token.startsWith('Bearer')) {
      token = token.slice(7, token.length);
    }

    // Verify the token and set req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    console.log(req.user);
    next();
  } catch (error) {
    // Adjusted to use the errorHandler for consistency
    errorHandler(res, 500, 'Failed to authenticate token.');
  }
};
