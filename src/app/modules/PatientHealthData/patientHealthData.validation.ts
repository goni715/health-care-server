import { nullable, z } from "zod";
import { BloodGroup } from "./patientHealthData.constant";

export const createPatientHealthDataSchema = z.object({
  patientId:z.string(),
  dateOfBirth: z
    .string()
    .transform((val) => new Date(val)),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  }),
  bloodGroup: z.enum([...BloodGroup] as [string, ...string[]], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  }),
  hasAllergies: z.boolean().nullable().optional(),
  hasDiabetes: z.boolean().nullable().optional(),
  height: z.string({
    required_error: "Height is required",
  }),
  weight: z.string({
    required_error: "Weight is required",
  }),
  smokingStatus: z.boolean().nullable().optional(),
  dietaryPreferences: z.string().nullable().optional(),
  pregnancyStatus: z.boolean().nullable().optional(),
  mentalHealthHistory: z.string().nullable().optional(),
  immunizationStatus: z.string().nullable().optional(),
  hasPastSurgeries: z.boolean().nullable().optional(),
  recentAnxiety: z.boolean().nullable().optional(),
  recentDepression: z.boolean().nullable().optional(),
  martialStatus: z
    .enum(["MARRIED", "UNMARRIED"], {
      errorMap: () => ({ message: "{VALUE} is not supported" }),
    })
    .default("UNMARRIED"),
});


export const updatePatientHealthDataSchema = z.object({
  dateOfBirth: z
    .string()
    .transform((val) => new Date(val)).optional(),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  }).optional(),
  bloodGroup: z.enum([...BloodGroup] as [string, ...string[]], {
    errorMap: () => ({ message: "{VALUE} is not supported" }),
  }).optional(),
  hasAllergies: z.boolean().nullable().optional(),
  hasDiabetes: z.boolean().nullable().optional(),
  height: z.string({
    required_error: "Height is required",
  }).optional(),
  weight: z.string({
    required_error: "Weight is required",
  }).optional(),
  smokingStatus: z.boolean().nullable().optional(),
  dietaryPreferences: z.string().nullable().optional(),
  pregnancyStatus: z.boolean().nullable().optional(),
  mentalHealthHistory: z.string().nullable().optional(),
  immunizationStatus: z.string().nullable().optional(),
  hasPastSurgeries: z.boolean().nullable().optional(),
  recentAnxiety: z.boolean().nullable().optional(),
  recentDepression: z.boolean().nullable().optional(),
  martialStatus: z
    .enum(["MARRIED", "UNMARRIED"], {
      errorMap: () => ({ message: "{VALUE} is not supported" }),
  }).optional()
});
