"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    appointmentId: zod_1.z.string({
        required_error: "appointmentId is required",
    }),
    rating: zod_1.z.number({
        required_error: "Rating is required",
    }),
    comment: zod_1.z.string({
        required_error: "Comment is required",
    }),
});
