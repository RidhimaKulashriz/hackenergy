import { Request, Response, NextFunction } from 'express';
import { NODE_ENV } from '../config/constants';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  // Log the error in development
  if (NODE_ENV === 'development') {
    console.error('Error 💥', {
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }

  // Handle specific error types
  if (error.name === 'CastError') {
    const message = `Resource not found with id of ${error.value}`;
    error = new AppError(message, 404);
  }

  // Handle duplicate field values
  if (error.code === 11000) {
    const value = error.errmsg.match(/(["'])(\\.|.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    error = new AppError(message, 400);
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    error = new AppError(message, 400);
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again!';
    error = new AppError(message, 401);
  }

  if (error.name === 'TokenExpiredError') {
    const message = 'Your token has expired! Please log in again.';
    error = new AppError(message, 401);
  }

  // Send response to client
  res.status(error.statusCode || 500).json({
    status: error.status,
    message: error.message || 'Something went wrong!',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
