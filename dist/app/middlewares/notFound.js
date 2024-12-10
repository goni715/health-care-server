"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res) => {
    res.status(404).json({
        status: false,
        message: 'Route Not Found!',
        error: {
            path: req.originalUrl,
            message: 'Your requested path is not found!'
        }
    });
};
exports.default = notFound;
