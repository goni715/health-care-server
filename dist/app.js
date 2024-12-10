"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const appointment_service_1 = require("./app/modules/Appointment/appointment.service");
const node_cron_1 = __importDefault(require("node-cron"));
const app = (0, express_1.default)();
//middleware implementation
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
//RequestBodySizeIncrease//Body Parser Implementation
app.use(body_parser_1.default.json({ limit: '30mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '30mb', extended: true }));
//automatic cancel unpaidAppointments
node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, appointment_service_1.cancelUnpaidAppointmentService)();
    }
    catch (err) {
        console.error(err);
    }
    //console.log('running a task every minute');
}));
(0, appointment_service_1.cancelUnpaidAppointmentService)();
//testing route
app.get("/", (req, res) => {
    res.send("This is PH Health Care server");
});
//application routes
app.use('/api/v1', routes_1.default);
//global error handler middleware
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
