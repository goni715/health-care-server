import { z } from "zod";

export const createAppointmentSchema = z.object({
    doctorId: z.string({
        required_error:"doctorId is required"
    }),
    scheduleId: z.string({
        required_error:"scheduleId is required"
    })
})


export const changeAppointmentStatusSchema = z.object({
    status: z.enum(['SCHEDULED', 'INPROGRESS', 'COMPLETED', 'CANCELED'])
})


export const changePaymentStatusSchema = z.object({
    status: z.enum(['PAID', 'UNPAID'])
})