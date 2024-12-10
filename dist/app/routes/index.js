"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_routes_1 = require("../modules/Admin/admin.routes");
const user_routes_1 = require("../modules/User/user.routes");
const auth_route_1 = require("../modules/Auth/auth.route");
const specialties_route_1 = require("../modules/Specialties/specialties.route");
const doctor_route_1 = require("../modules/Doctor/doctor.route");
const patient_route_1 = require("../modules/Patient/patient.route");
const patientHealthData_route_1 = require("../modules/PatientHealthData/patientHealthData.route");
const medicalReport_route_1 = require("../modules/MedicalReport/medicalReport.route");
const schedule_route_1 = require("../modules/Schedule/schedule.route");
const doctorSchedule_route_1 = require("../modules/DoctorSchedule/doctorSchedule.route");
const appointment_route_1 = require("../modules/Appointment/appointment.route");
const payment_routes_1 = require("../modules/Payment/payment.routes");
const prescription_route_1 = require("../modules/Prescription/prescription.route");
const review_route_1 = require("../modules/Review/review.route");
const meta_routes_1 = require("../modules/Meta/meta.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes
    },
    {
        path: "/admin",
        route: admin_routes_1.AdminRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/specialties",
        route: specialties_route_1.SpecialtiesRoutes
    },
    {
        path: "/doctor",
        route: doctor_route_1.DoctorRoutes
    },
    {
        path: "/patient",
        route: patient_route_1.PatientRoutes
    },
    {
        path: "/patient-health-data",
        route: patientHealthData_route_1.PatientHealthDataRoutes
    },
    {
        path: "/medical-report",
        route: medicalReport_route_1.MedicalReportRoutes
    },
    {
        path: "/schedule",
        route: schedule_route_1.ScheduleRoutes
    },
    {
        path: "/doctor-schedule",
        route: doctorSchedule_route_1.DoctorScheduleRoutes
    },
    {
        path: "/appointment",
        route: appointment_route_1.AppointmentRoutes
    },
    {
        path: "/payment",
        route: payment_routes_1.PaymentRoutes
    },
    {
        path: "/prescription",
        route: prescription_route_1.PrescriptionRoutes
    },
    {
        path: "/review",
        route: review_route_1.ReviewRoutes
    },
    {
        path: "/meta",
        route: meta_routes_1.MetaRoutes
    }
];
moduleRoutes.forEach((item) => router.use(item.path, item.route));
//router.use('/user', userRoutes);
//router.use('/admin', AdminRoutes);
exports.default = router;
