"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpecialtiesSchema = void 0;
const zod_1 = require("zod");
exports.createSpecialtiesSchema = zod_1.z.object({
    title: zod_1.z.string({
        required_error: "Title is required"
    })
});
