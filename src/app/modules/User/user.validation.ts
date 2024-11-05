import { z } from "zod";

export const changeStatusValidationSchema = z.object({
    status:  z.enum(['active', 'blocked'] as [string, ...string[]])
})