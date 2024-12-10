"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidationSchema = exports.forgotPasswordValidationSchema = exports.changePasswordValidationSchema = exports.refreshTokenValidationSchema = exports.loginUserValidationSchema = void 0;
const zod_1 = require("zod");
const NonWhiteSpaceRegex = /^\S*$/;
exports.loginUserValidationSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .trim()
        .email({ message: "Invalid email address" }),
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
});
exports.refreshTokenValidationSchema = zod_1.z.object({
    refreshToken: zod_1.z.string({
        required_error: 'Refresh token is required !'
    })
});
exports.changePasswordValidationSchema = zod_1.z.object({
    oldPassword: zod_1.z
        .string({
        required_error: "Old Password is required !",
    })
        .min(6, { message: "Old Password minimum 6 characters" })
        .trim()
        .max(60, { message: "Old Password maximum 60 characters" })
        .refine((value) => NonWhiteSpaceRegex.test(value), {
        message: "Old Password must not contain Whitespaces!",
    }),
    newPassword: zod_1.z
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
exports.forgotPasswordValidationSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .trim()
        .email({ message: "Invalid email address" }),
});
exports.resetPasswordValidationSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .trim()
        .email({ message: "Invalid email address" }),
    newPassword: zod_1.z
        .string({
        required_error: "New Password is required !",
    })
        .min(6, { message: "New Password minimum 6 characters" })
        .trim()
        .max(60, { message: "New Password maximum 60 characters" })
        .refine((value) => NonWhiteSpaceRegex.test(value), {
        message: "New Password must not contain Whitespaces!",
    }),
    token: zod_1.z.string({
        required_error: "Reset token is required !",
    }),
});
