"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_validation_1 = require("./admin.validation");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get('/get-all-admins', (0, AuthMiddleware_1.default)(client_1.UserRole.admin, client_1.UserRole.super_admin), admin_controller_1.adminController.getAllAdmins);
router.get('/get-single-admin/:id', (0, AuthMiddleware_1.default)(client_1.UserRole.admin, client_1.UserRole.super_admin), admin_controller_1.adminController.getSingleAdmin);
router.patch('/update-admin/:id', (0, AuthMiddleware_1.default)(client_1.UserRole.admin, client_1.UserRole.super_admin), (0, validateRequest_1.default)(admin_validation_1.updateAdminValidationSchema), admin_controller_1.adminController.updateAdmin);
router.delete('/delete-admin/:id', (0, AuthMiddleware_1.default)(client_1.UserRole.admin, client_1.UserRole.super_admin), admin_controller_1.adminController.deleteAdmin);
router.delete('/soft-delete-admin/:id', (0, AuthMiddleware_1.default)(client_1.UserRole.admin, client_1.UserRole.super_admin), admin_controller_1.adminController.softDeleteAdmin);
exports.AdminRoutes = router;
