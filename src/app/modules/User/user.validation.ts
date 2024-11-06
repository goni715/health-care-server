import { z } from "zod";
import capitalizeValidator from "../../helper/capitalizeValidator";
import { MobileRegx } from "../../constants/global.constant";

export const changeStatusValidationSchema = z.object({
    status:  z.enum(['active', 'blocked'] as [string, ...string[]])
})


export const updateMyProfileSchema = z.object({
  adminData: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(1, { message: '"Name is required"' })
      .trim()
      .max(60, "Name maximum 60 characters.")
      .refine(capitalizeValidator, {
        message: "Name must be in capitalize format",
      })
      .refine((value) => /^[A-Za-z\s]+$/.test(value), {
        message: "Name must only contain alphabets", //"Name must only contain letters and spaces"
      })
      .optional(),
    contactNumber: z
      .string()
      .trim()
      .min(1, { message: "Contact Number is required" })
      .trim()
      .refine((value) => MobileRegx.test(value), {
        message: "Invalid Mobile Number",
      })
      .optional(),
  }).optional(),
  doctorData: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(1, { message: '"Name is required"' })
      .trim()
      .max(60, "Name maximum 60 characters.")
      .refine(capitalizeValidator, {
        message: "Name must be in capitalize format",
      })
      .refine((value) => /^[A-Za-z\s]+$/.test(value), {
        message: "Name must only contain alphabets", //"Name must only contain letters
      })
      .optional(),
    contactNumber: z
      .string()
      .trim()
      .min(1, { message: "Contact Number is required" })
      .trim()
      .refine((value) => MobileRegx.test(value), {
        message: "Invalid Mobile Number",
      }).optional(),
    address: z
      .string({
        required_error: "Address is required",
      })
      .min(1, { message: "Address is required" })
      .trim()
      .max(60, "Address maximum 60 characters.")
      .optional(),
    registrationNumber: z
      .string({
        required_error: "Registration Number is required",
      })
      .min(1, { message: "Registration Number is required" })
      .trim()
      .max(60, "Registration Number maximum 60 characters.")
      .optional(),
    experience: z.number().optional(),
    gender: z.enum(["male", "female"], {
      errorMap: () => ({ message: "{VALUE} is not supported" }),
    }).optional(),
    appointmentFee: z
      .number({
        required_error: "Appointment Fee is required",
      })
      .min(1, { message: "Appointment Fee is required" })
      .optional(),
    qualification: z
      .string({
        required_error: "Qualification is required",
      })
      .min(1, { message: "Qualification is required" })
      .trim().optional(),
    currentWorkingPlace: z
      .string({
        required_error: "currentWorkingPlace is required",
      })
      .min(1, { message: "urrentWorkingPlace is required" })
      .trim()
      .optional(),
    designation: z
      .string({
        required_error: "Designation is required",
      })
      .min(1, { message: "Designation is required" })
      .trim()
      .optional()
  }).optional(),
  patientData: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(1, { message: '"Name is required"' })
      .trim()
      .max(60, "Name maximum 60 characters.")
      .refine(capitalizeValidator, {
        message: "Name must be in capitalize format",
      })
      .refine((value) => /^[A-Za-z\s]+$/.test(value), {
        message: "Name must only contain alphabets", //"Name must only contain letters and spaces"
      }).optional(),
    contactNumber: z
      .string()
      .trim()
      .min(1, { message: "Contact Number is required" })
      .trim()
      .refine((value) => MobileRegx.test(value), {
        message: "Invalid Mobile Number",
      }).optional(),
    address: z
      .string({
        required_error: "Address is required",
      })
      .min(1, { message: "Address is required" })
      .trim()
      .max(60, "Address maximum 60 characters.")
      .optional(),
  }).optional(),
});