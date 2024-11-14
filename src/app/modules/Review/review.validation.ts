import { z } from "zod";

export const createReviewSchema = z.object({
  appointmentId: z.string({
    required_error: "appointmentId is required",
  }),
  rating: z.number({
    required_error: "Rating is required",
  }),
  comment: z.string({
    required_error: "Comment is required",
  }),
});