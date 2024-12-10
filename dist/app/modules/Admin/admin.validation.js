"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminValidationSchema = exports.createAdminValidationSchema = void 0;
const zod_1 = require("zod");
const capitalizeValidator_1 = __importDefault(require("../../helper/capitalizeValidator"));
const MobileRegx = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/;
const NonWhiteSpaceRegex = /^\S*$/;
exports.createAdminValidationSchema = zod_1.z.object({
    password: zod_1.z
        .string({
        required_error: "Password is required !",
    })
        .min(6, { message: "Password minimum 6 characters" })
        .trim()
        .max(60, { message: "Password maximum 60 characters" })
        .refine((value) => NonWhiteSpaceRegex.test(value), {
        message: "Password must not contain Whitespaces!",
    }),
    adminData: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .trim()
            .email({ message: "Invalid email address" }),
        name: zod_1.z
            .string({
            required_error: "Name is required",
        })
            .min(1, { message: '"Name is required"' })
            .trim()
            .max(60, "Name maximum 60 characters.")
            .refine(capitalizeValidator_1.default, {
            message: "Name must be in capitalize format",
        })
            .refine((value) => /^[A-Za-z\s]+$/.test(value), {
            message: "Name must only contain alphabets", //"Name must only contain letters and spaces"
        }),
        contactNumber: zod_1.z
            .string()
            .trim()
            .min(1, { message: "Contact Number is required" })
            .trim()
            .refine((value) => MobileRegx.test(value), {
            message: "Invalid Mobile Number",
        })
    }),
});
exports.updateAdminValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        required_error: "Name is required",
    })
        .min(1, { message: '"Name is required"' })
        .trim()
        .max(60, "Name maximum 60 characters.")
        .refine(capitalizeValidator_1.default, {
        message: "Name must be in capitalize format",
    })
        .refine((value) => /^[A-Za-z\s]+$/.test(value), {
        message: "Name must only contain alphabets", //"Name must only contain letters and spaces"
    }).optional(),
    contactNumber: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Contact Number is required" })
        .trim()
        .refine((value) => MobileRegx.test(value), {
        message: "Invalid Mobile Number",
    }).optional()
});
