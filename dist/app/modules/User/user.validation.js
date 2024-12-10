"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyProfileSchema = exports.changeStatusValidationSchema = void 0;
const zod_1 = require("zod");
const capitalizeValidator_1 = __importDefault(require("../../helper/capitalizeValidator"));
const global_constant_1 = require("../../constants/global.constant");
exports.changeStatusValidationSchema = zod_1.z.object({
    status: zod_1.z.enum(['active', 'blocked'])
});
exports.updateMyProfileSchema = zod_1.z.object({
    adminData: zod_1.z.object({
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
        })
            .optional(),
        contactNumber: zod_1.z
            .string()
            .trim()
            .min(1, { message: "Contact Number is required" })
            .trim()
            .refine((value) => global_constant_1.MobileRegx.test(value), {
            message: "Invalid Mobile Number",
        })
            .optional(),
    }).optional(),
    doctorData: zod_1.z.object({
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
            message: "Name must only contain alphabets", //"Name must only contain letters
        })
            .optional(),
        contactNumber: zod_1.z
            .string()
            .trim()
            .min(1, { message: "Contact Number is required" })
            .trim()
            .refine((value) => global_constant_1.MobileRegx.test(value), {
            message: "Invalid Mobile Number",
        }).optional(),
        address: zod_1.z
            .string({
            required_error: "Address is required",
        })
            .min(1, { message: "Address is required" })
            .trim()
            .max(60, "Address maximum 60 characters.")
            .optional(),
        registrationNumber: zod_1.z
            .string({
            required_error: "Registration Number is required",
        })
            .min(1, { message: "Registration Number is required" })
            .trim()
            .max(60, "Registration Number maximum 60 characters.")
            .optional(),
        experience: zod_1.z.number().optional(),
        gender: zod_1.z.enum(["male", "female"], {
            errorMap: () => ({ message: "{VALUE} is not supported" }),
        }).optional(),
        appointmentFee: zod_1.z
            .number({
            required_error: "Appointment Fee is required",
        })
            .min(1, { message: "Appointment Fee is required" })
            .optional(),
        qualification: zod_1.z
            .string({
            required_error: "Qualification is required",
        })
            .min(1, { message: "Qualification is required" })
            .trim().optional(),
        currentWorkingPlace: zod_1.z
            .string({
            required_error: "currentWorkingPlace is required",
        })
            .min(1, { message: "urrentWorkingPlace is required" })
            .trim()
            .optional(),
        designation: zod_1.z
            .string({
            required_error: "Designation is required",
        })
            .min(1, { message: "Designation is required" })
            .trim()
            .optional()
    }).optional(),
    patientData: zod_1.z.object({
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
            .refine((value) => global_constant_1.MobileRegx.test(value), {
            message: "Invalid Mobile Number",
        }).optional(),
        address: zod_1.z
            .string({
            required_error: "Address is required",
        })
            .min(1, { message: "Address is required" })
            .trim()
            .max(60, "Address maximum 60 characters.")
            .optional(),
    }).optional(),
});
