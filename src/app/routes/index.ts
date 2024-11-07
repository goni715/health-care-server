import express from 'express';
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from '../modules/Auth/auth.route';
import { SpecialtiesRoutes } from '../modules/Specialties/specialties.route';
import { DoctorRoutes } from '../modules/Doctor/doctor.route';
import { PatientRoutes } from '../modules/Patient/patient.route';

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
    }
]


moduleRoutes.forEach((item)=> router.use(item.path, item.route));

//router.use('/user', userRoutes);
//router.use('/admin', AdminRoutes);


export default router;