import { z } from "zod";
import capitalizeValidator from "../../helper/capitalizeValidator";

const MobileRegx = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/;
const NonWhiteSpaceRegex = /^\S*$/;



export const createAdminValidationSchema = z.object({
  password: z
    .string({
      required_error: "Password is required !",
    })
    .min(6, { message: "Password minimum 6 characters" })
    .trim()
    .max(60, { message: "Password maximum 60 characters" })
    .refine((value) => NonWhiteSpaceRegex.test(value), {
      message: "Password must not contain Whitespaces!",
    }),
  adminData: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .trim()
      .email({ message: "Invalid email address" }),
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
  }),
});




export const updateAdminValidationSchema = z.object({
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
    }).optional()
});








