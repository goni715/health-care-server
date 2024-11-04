import { z } from "zod";
const NonWhiteSpaceRegex = /^\S*$/;



export const loginUserValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .email({ message: "Invalid email address" }),
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
});


export const refreshTokenValidationSchema = z.object({
  refreshToken: z.string({
      required_error: 'Refresh token is required !'
  })
})


export const changePasswordValidationSchema = z.object({
  oldPassword: z
  .string({
    required_error: "Old Password is required !",
  })
  .min(6, { message: "Old Password minimum 6 characters" })
  .trim()
  .max(60, { message: "Old Password maximum 60 characters" })
  .refine((value) => NonWhiteSpaceRegex.test(value), {
    message: "Old Password must not contain Whitespaces!", 
  }),
  newPassword: z
  .string({
    required_error: "New Password is required !",
  })
  .min(6, { message: "New Password minimum 6 characters" })
  .trim()
  .max(60, { message: "New Password maximum 60 characters" })
  .refine((value) => NonWhiteSpaceRegex.test(value), {
    message: "New Password must not contain Whitespaces!",
  }),
});


export const forgotPasswordValidationSchema = z.object({
  email: z
  .string({
    required_error: "Email is required",
  })
  .trim()
  .email({ message: "Invalid email address" }),
})