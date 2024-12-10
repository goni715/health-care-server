"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrescriptionSchema = void 0;
const zod_1 = require("zod");
exports.createPrescriptionSchema = zod_1.z.object({
    appointmentId: zod_1.z.string({
        required_error: "appointmentId is required"
    }),
    instructions: zod_1.z.string({
        required_error: "instructions required"
    }),
    followUpDate: zod_1.z
        .string()
        .transform((val) => new Date(val)).optional(),
});
