"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const specialties_controller_1 = require("./specialties.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const specialties_validation_1 = require("./specialties.validation");
const upload_1 = __importDefault(require("../../helper/upload"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/create-specialties", (0, AuthMiddleware_1.default)("admin", "super_admin"), upload_1.default.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(specialties_validation_1.createSpecialtiesSchema), specialties_controller_1.SpecialtiesController.createSpecialties);
router.get('/get-all-specialties', (0, AuthMiddleware_1.default)(client_1.UserRole.admin, client_1.UserRole.super_admin, client_1.UserRole.doctor), specialties_controller_1.SpecialtiesController.getAllSpecialties);
router.delete('/delete-specialties/:id', (0, AuthMiddleware_1.default)('admin', 'super_admin', 'doctor', 'patient'), specialties_controller_1.SpecialtiesController.deleteSpecialties);
router.patch('/update-icon/:id', (0, AuthMiddleware_1.default)('admin', 'doctor', 'super_admin'), upload_1.default.single('file'), specialties_controller_1.SpecialtiesController.updateIcon);
exports.SpecialtiesRoutes = router;
