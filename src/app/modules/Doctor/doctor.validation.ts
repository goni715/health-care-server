import { z } from "zod";
import capitalizeValidator from "../../helper/capitalizeValidator";
const MobileRegx = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/;
const NonWhiteSpaceRegex = /^\S*$/;


export const createDoctorSchema = z.object({
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
  doctorData: z.object({
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
        message: "Name must only contain alphabets", //"Name must only contain letters
      }),
    contactNumber: z
      .string()
      .trim()
      .min(1, { message: "Contact Number is required" })
      .trim()
      .refine((value) => MobileRegx.test(value), {
        message: "Invalid Mobile Number",
      }),
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
      .max(60, "Registration Number maximum 60 characters."),
    experience: z.number().default(0),
    gender: z.enum(["male", "female"], {
      errorMap: () => ({ message: "{VALUE} is not supported" }),
    }),
    appointmentFee: z
      .number({
        required_error: "Appointment Fee is required",
      })
      .min(1, { message: "Appointment Fee is required" }),
    qualification: z
      .string({
        required_error: "Qualification is required",
      })
      .min(1, { message: "Qualification is required" })
      .trim(),
    currentWorkingPlace: z
      .string({
        required_error: "currentWorkingPlace is required",
      })
      .min(1, { message: "urrentWorkingPlace is required" })
      .trim(),
    designation: z
      .string({
        required_error: "Designation is required",
      })
      .min(1, { message: "Designation is required" })
      .trim(),
  }),
});

