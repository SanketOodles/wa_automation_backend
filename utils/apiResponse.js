/**
 * Standard API response format
 */

/**
 * Success response helper
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {*} data - Response data
 * @param {Number} statusCode - HTTP status code (default: 200)
 * @returns {Object} - Formatted success response
 */
exports.successResponse = (res, message = 'Success', data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Error response helper
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 500)
 * @param {*} error - Error details (optional, not returned in production)
 * @returns {Object} - Formatted error response
 */
exports.errorResponse = (res, message = 'Error', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message
  };

  // Only include error details in non-production environments
  if (error && process.env.NODE_ENV !== 'production') {
    response.error = error.toString();
  }

  return res.status(statusCode).json(response);
};
