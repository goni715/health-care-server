"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (payload, secretKey, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secretKey, {
        algorithm: "HS256",
        expiresIn
    });
    return token;
};
exports.default = createToken;
