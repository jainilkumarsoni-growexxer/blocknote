import { NODE_ENV } from '../config/env.js';

// Custom error class for API-specific errors
export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 handler for unmatched routes
export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message, errors = [] } = err;

  // Handle PostgreSQL unique violation (23505)
  if (err.code === '23505') {
    statusCode = 409;
    message = 'Resource already exists';
    if (err.constraint?.includes('email')) {
      message = 'Email already registered';
    }
  }

  // Handle PostgreSQL foreign key violation (23503)
  if (err.code === '23503') {
    statusCode = 400;
    message = 'Invalid reference: related resource does not exist';
  }

  // Handle JWT errors (if they bubble up)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log errors in development
  if (NODE_ENV === 'development') {
    console.error('ERROR:', {
      statusCode,
      message,
      stack: err.stack,
      errors,
    });
  } else {
    // In production, log only 5xx errors minimally
    if (statusCode >= 500) {
      console.error('SERVER ERROR:', { message, stack: err.stack });
    }
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
};