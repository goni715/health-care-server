import { z } from "zod";


export const createMedicalReportSchema = z.object({
    patientId: z.string({
        required_error:"patientId is required"
    }),
    reportName: z.string({
        required_error:"reportName is required"
    }),
    reportLink: z.string({
        required_error:"reportLink is required"
    })
})