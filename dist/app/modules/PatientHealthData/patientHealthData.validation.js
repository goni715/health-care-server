"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientHealthDataSchema = exports.createPatientHealthDataSchema = void 0;
const zod_1 = require("zod");
const patientHealthData_constant_1 = require("./patientHealthData.constant");
exports.createPatientHealthDataSchema = zod_1.z.object({
    patientId: zod_1.z.string(),
    dateOfBirth: zod_1.z
        .string()
        .transform((val) => new Date(val)),
    gender: zod_1.z.enum(["male", "female"], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    }),
    bloodGroup: zod_1.z.enum([...patientHealthData_constant_1.BloodGroup], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    }),
    hasAllergies: zod_1.z.boolean().nullable().optional(),
    hasDiabetes: zod_1.z.boolean().nullable().optional(),
    height: zod_1.z.string({
        required_error: "Height is required",
    }),
    weight: zod_1.z.string({
        required_error: "Weight is required",
    }),
    smokingStatus: zod_1.z.boolean().nullable().optional(),
    dietaryPreferences: zod_1.z.string().nullable().optional(),
    pregnancyStatus: zod_1.z.boolean().nullable().optional(),
    mentalHealthHistory: zod_1.z.string().nullable().optional(),
    immunizationStatus: zod_1.z.string().nullable().optional(),
    hasPastSurgeries: zod_1.z.boolean().nullable().optional(),
    recentAnxiety: zod_1.z.boolean().nullable().optional(),
    recentDepression: zod_1.z.boolean().nullable().optional(),
    martialStatus: zod_1.z
        .enum(["MARRIED", "UNMARRIED"], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    })
        .default("UNMARRIED"),
});
exports.updatePatientHealthDataSchema = zod_1.z.object({
    dateOfBirth: zod_1.z
        .string()
        .transform((val) => new Date(val)).optional(),
    gender: zod_1.z.enum(["male", "female"], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    }).optional(),
    bloodGroup: zod_1.z.enum([...patientHealthData_constant_1.BloodGroup], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    }).optional(),
    hasAllergies: zod_1.z.boolean().nullable().optional(),
    hasDiabetes: zod_1.z.boolean().nullable().optional(),
    height: zod_1.z.string({
        required_error: "Height is required",
    }).optional(),
    weight: zod_1.z.string({
        required_error: "Weight is required",
    }).optional(),
    smokingStatus: zod_1.z.boolean().nullable().optional(),
    dietaryPreferences: zod_1.z.string().nullable().optional(),
    pregnancyStatus: zod_1.z.boolean().nullable().optional(),
    mentalHealthHistory: zod_1.z.string().nullable().optional(),
    immunizationStatus: zod_1.z.string().nullable().optional(),
    hasPastSurgeries: zod_1.z.boolean().nullable().optional(),
    recentAnxiety: zod_1.z.boolean().nullable().optional(),
    recentDepression: zod_1.z.boolean().nullable().optional(),
    martialStatus: zod_1.z
        .enum(["MARRIED", "UNMARRIED"], {
        errorMap: () => ({ message: "{VALUE} is not supported" }),
    }).optional()
});
