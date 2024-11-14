import { z } from "zod";

export const createPrescriptionSchema = z.object({
    appointmentId: z.string({
        required_error:"appointmentId is required"
    }),
    instructions: z.string({
        required_error:"instructions required"
    }),
    followUpDate: z
    .string()
    .transform((val) => new Date(val)).optional(),
})