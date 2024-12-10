"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const meta_controller_1 = require("./meta.controller");
const router = express_1.default.Router();
router.get("/fetch-meta-data", (0, AuthMiddleware_1.default)("admin", "super_admin", 'doctor', 'patient'), meta_controller_1.MetaController.fetchDashboardMetaData);
exports.MetaRoutes = router;
