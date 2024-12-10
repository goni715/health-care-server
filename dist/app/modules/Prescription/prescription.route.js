"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const prescription_controller_1 = require("./prescription.controller");
const prescription_validation_1 = require("./prescription.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router.post("/create-prescription", (0, AuthMiddleware_1.default)("doctor"), (0, validateRequest_1.default)(prescription_validation_1.createPrescriptionSchema), prescription_controller_1.PrescriptionController.createPrescription);
router.get("/get-my-prescription", (0, AuthMiddleware_1.default)("doctor", "patient"), prescription_controller_1.PrescriptionController.getMyPrescription);
router.get("/get-all-prescriptions", (0, AuthMiddleware_1.default)("admin", "super_admin"), prescription_controller_1.PrescriptionController.getAllPrescriptions);
exports.PrescriptionRoutes = router;
