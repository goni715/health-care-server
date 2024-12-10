"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const hashedPassword_1 = __importDefault(require("../utils/hashedPassword"));
const config_1 = __importDefault(require("../config"));
const prisma = new client_1.PrismaClient();
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExistSuperAdmin = yield prisma.user.findFirst({
            where: {
                role: client_1.UserRole.super_admin
            }
        });
        if (isExistSuperAdmin) {
            console.log("Super admin already exists!");
            return;
        }
        ;
        const hashedPass = yield (0, hashedPassword_1.default)(config_1.default.super_admin_password);
        const superAdminData = yield prisma.user.create({
            data: {
                email: config_1.default.super_admin_email,
                password: hashedPass,
                role: "super_admin",
                admin: {
                    create: {
                        name: "Super Admin",
                        //email: "super@admin.com", //not required
                        contactNumber: "01793837035"
                    }
                }
            }
        });
        console.log("Super Admin Created Successfully!", superAdminData);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        yield prisma.$disconnect();
    }
});
seedSuperAdmin();
