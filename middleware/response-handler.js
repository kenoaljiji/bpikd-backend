// Define responseHandler
export const responseHandler = (data, res, message, status) => {
  const statusCode = status || 200;
  res.status(statusCode).json({
    status: statusCode,
    message: message || "Success",
    data: data,
  });
};

// Define errorHandler
export const errorHandler = (status, res, message) => {
  const statusCode = status || 500;
  res.status(statusCode).json({
    code: statusCode,
    status: "error",
    message: message || "Error",
  });
};

// middleware/authorizeAdmin.js
export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).send({ message: "Access denied. Admins only." });
  }
};
