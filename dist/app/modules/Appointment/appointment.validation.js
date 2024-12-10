"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePaymentStatusSchema = exports.changeAppointmentStatusSchema = exports.createAppointmentSchema = void 0;
const zod_1 = require("zod");
exports.createAppointmentSchema = zod_1.z.object({
    doctorId: zod_1.z.string({
        required_error: "doctorId is required"
    }),
    scheduleId: zod_1.z.string({
        required_error: "scheduleId is required"
    })
});
exports.changeAppointmentStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['SCHEDULED', 'INPROGRESS', 'COMPLETED', 'CANCELED'])
});
exports.changePaymentStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PAID', 'UNPAID'])
});
