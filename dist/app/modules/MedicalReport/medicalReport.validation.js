"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMedicalReportSchema = void 0;
const zod_1 = require("zod");
exports.createMedicalReportSchema = zod_1.z.object({
    patientId: zod_1.z.string({
        required_error: "patientId is required"
    }),
    reportName: zod_1.z.string({
        required_error: "reportName is required"
    }),
    reportLink: zod_1.z.string({
        required_error: "reportLink is required"
    })
});
