"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDoctorSchema = exports.createDoctorSchema = void 0;
const zod_1 = require("zod");
const capitalizeValidator_1 = __importDefault(require("../../helper/capitalizeValidator"));
const MobileRegx = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/;
const NonWhiteSpaceRegex = /^\S*$/;
exports.createDoctorSchema = zod_1.z.object({
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
    doctorData: zod_1.z.object({
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
            message: "Name must only contain alphabets", //"Name must only contain letters
        }),
        contactNumber: zod_1.z
            .string()
            .trim()
            .min(1, { message: "Contact Number is required" })
            .trim()
            .refine((value) => MobileRegx.test(value), {
            message: "Invalid Mobile Number",
        }),
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
            .max(60, "Registration Number maximum 60 characters."),
        experience: zod_1.z.number().default(0),
        gender: zod_1.z.enum(["male", "female"], {
            errorMap: () => ({ message: "{VALUE} is not supported" }),
        }),
        appointmentFee: zod_1.z
            .number({
            required_error: "Appointment Fee is required",
        })
            .min(1, { message: "Appointment Fee is required" }),
        qualification: zod_1.z
            .string({
            required_error: "Qualification is required",
        })
            .min(1, { message: "Qualification is required" })
            .trim(),
        currentWorkingPlace: zod_1.z
            .string({
            required_error: "currentWorkingPlace is required",
        })
            .min(1, { message: "urrentWorkingPlace is required" })
            .trim(),
        designation: zod_1.z
            .string({
            required_error: "Designation is required",
        })
            .min(1, { message: "Designation is required" })
            .trim(),
    }),
});
exports.updateDoctorSchema = zod_1.z.object({
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
        .refine((value) => MobileRegx.test(value), {
        message: "Invalid Mobile Number",
    })
        .optional(),
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
    gender: zod_1.z
        .enum(["male", "female"], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    })
        .optional(),
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
        .trim()
        .optional(),
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
        .optional(),
    specialties: zod_1.z.array(zod_1.z.object({
        specialtiesId: zod_1.z.string(),
        isDeleted: zod_1.z.boolean()
    })).default([])
});
