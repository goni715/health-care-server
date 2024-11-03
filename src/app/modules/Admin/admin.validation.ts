import { z } from "zod";
import capitalizeValidator from "../../helper/capitalizeValidator";

const MobileRegx = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/;

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




