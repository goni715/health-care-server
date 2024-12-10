"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.loginUserValidationSchema), auth_controller_1.AuthController.loginUser);
//get new accessToken by refreshToken
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.refreshTokenValidationSchema), auth_controller_1.AuthController.refreshToken);
router.patch('/change-password', (0, AuthMiddleware_1.default)('admin', 'super_admin', 'doctor', 'patient'), (0, validateRequest_1.default)(auth_validation_1.changePasswordValidationSchema), auth_controller_1.AuthController.changePassword);
router.post('/forgot-password', (0, validateRequest_1.default)(auth_validation_1.forgotPasswordValidationSchema), auth_controller_1.AuthController.forgotPassword);
router.patch('/reset-password', (0, validateRequest_1.default)(auth_validation_1.resetPasswordValidationSchema), auth_controller_1.AuthController.resetPassword);
exports.AuthRoutes = router;
