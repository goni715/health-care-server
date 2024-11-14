import express from 'express';
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from '../modules/Auth/auth.route';
import { SpecialtiesRoutes } from '../modules/Specialties/specialties.route';
import { DoctorRoutes } from '../modules/Doctor/doctor.route';
import { PatientRoutes } from '../modules/Patient/patient.route';
import { PatientHealthDataRoutes } from '../modules/PatientHealthData/patientHealthData.route';
import { MedicalReportRoutes } from '../modules/MedicalReport/medicalReport.route';
import { ScheduleRoutes } from '../modules/Schedule/schedule.route';
import { DoctorScheduleRoutes } from '../modules/DoctorSchedule/doctorSchedule.route';
import { AppointmentRoutes } from '../modules/Appointment/appointment.route';
import { PaymentRoutes } from '../modules/Payment/payment.routes';
import { PrescriptionRoutes } from '../modules/Prescription/prescription.route';
import { ReviewRoutes } from '../modules/Review/review.route';

const router = express.Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/admin",
        route: AdminRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/specialties",
        route: SpecialtiesRoutes
    },
    {
        path: "/doctor",
        route: DoctorRoutes
    },
    {
        path: "/patient",
        route: PatientRoutes
    },
    {
        path: "/patient-health-data",
        route: PatientHealthDataRoutes
    },
    {
        path: "/medical-report",
        route: MedicalReportRoutes
    },
    {
        path: "/schedule",
        route: ScheduleRoutes
    },
    {
        path: "/doctor-schedule",
        route: DoctorScheduleRoutes
    },
    {
        path: "/appointment",
        route: AppointmentRoutes
    },
    {
        path: "/payment",
        route: PaymentRoutes
    },
    {
        path: "/prescription",
        route: PrescriptionRoutes
    },
    {
        path: "/review",
        route: ReviewRoutes
    }
]


moduleRoutes.forEach((item)=> router.use(item.path, item.route));

//router.use('/user', userRoutes);
//router.use('/admin', AdminRoutes);


export default router;