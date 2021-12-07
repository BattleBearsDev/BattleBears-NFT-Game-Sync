import { NextFunction, Request, Response } from "express";
import logger from "../logger";

export class ErrorHandler extends Error {
    status : number;
    code: string;
    constructor(status: number, message: string) {
        super();
        this.message = message;
        this.status = status;
        this.code = '';
    }
}

export class ValidationError extends ErrorHandler {
    constructor(message: string) {
        super(400, message);
        this.code = 'validation_error';
    }
}

export class AuthError extends ErrorHandler {
    constructor(message: string) {
        super(401, message);
        this.code = 'auth_error';
    }
}

export class TokenExpiredError extends ErrorHandler {
    constructor(message: string) {
        super(401, message);
        this.code = 'token_expired';
    }
}

export class PermissionError extends ErrorHandler {
    constructor(message: string) {
        super(403, message);
        this.code = 'permission_error';
    }
}

export class NotFoundError extends ErrorHandler {
    constructor(message: string) {
        super(404, message);
        this.code = 'not_found_error';
    }
}

export class InternalServerError extends ErrorHandler {
    constructor(message: string) {
        super(500, message);
        this.code = 'internal_server_error';
    }
}

export const errorHandler = (opts: any = {}) => (err: ErrorHandler | any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = 'Internal server error';
    
    if (err instanceof ErrorHandler) {
        statusCode = err.status || statusCode;
        message = err.message;
    }
    if (opts.debug) {
        logger.error(JSON.stringify(err));
        if (!(err instanceof ErrorHandler)) {
            message = err.message ||  err.response?.body?.message;
        }
    } else {
        if (statusCode >= 500) {
            statusCode = err.status || 500;
            message = err.response?.body?.message || 'Something went wrong, please try again';
        }
    }

    res.status(statusCode).json({
        error: true,
        code: err.code || 'unknown_error',
        message
    });

    return next();
}