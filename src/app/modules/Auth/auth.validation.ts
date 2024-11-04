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
      message: "Password must not contain Whitespaces!", //"Name must only contain letters and spaces"
    }),
});


export const refreshTokenValidationSchema = z.object({
  refreshToken: z.string({
      required_error: 'Refresh token is required !'
  })
})
