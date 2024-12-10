"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something Went Wrong';
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            statusCode = 400;
            message = 'File size too large. Max limit is 1MB.';
            //return res.status(400).json({success: false, message: 'File size too large. Max limit is 1MB.', error: err });
        }
    }
    //prisma error handling
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = 403;
        message = "validation error";
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            message = "Duplicate Key error";
        }
    }
    return res.status(statusCode).json({
        success: false,
        message,
        error: err
    });
};
exports.default = globalErrorHandler;
