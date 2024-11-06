import { z } from "zod";

export const createSpecialtiesSchema = z.object({
    title: z.string({
        required_error:"Title is required"
    })
})