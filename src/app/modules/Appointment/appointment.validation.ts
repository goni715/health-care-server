import { z } from "zod";

export const createAppointmentSchema = z.object({
    doctorId: z.string({
        required_error:"doctorId is required"
    }),
    scheduleId: z.string({
        required_error:"scheduleId is required"
    })
})