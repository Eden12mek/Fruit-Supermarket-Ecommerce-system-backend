class ErrorHandler extends Error {
  /**
   * Create custom error handler
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // This is for operational errors we trust

    // Capture the stack trace (excluding the constructor call from the trace)
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware
export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle different error types
  if (process.env.NODE_ENV === 'development') {
    // Development: Send detailed error
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production: Send generic message
    
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } 
    // Programming or other unknown error: don't leak error details
    else {
      // 1) Log error
      console.error('ERROR 💥', err);
      
      // 2) Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  }
};

// Handle specific Mongoose errors
export const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ErrorHandler(message, 400);
};

export const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ErrorHandler(message, 400);
};

export const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ErrorHandler(message, 400);
};

export const handleJWTError = () => 
  new ErrorHandler('Invalid token. Please log in again!', 401);

export const handleJWTExpiredError = () => 
  new ErrorHandler('Your token has expired! Please log in again.', 401);

export default ErrorHandler;