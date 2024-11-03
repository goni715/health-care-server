import express from 'express';
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { userRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from '../modules/Auth/auth.route';

const router = express.Router()

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/admin",
        route: AdminRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    }
]


moduleRoutes.forEach((item)=> router.use(item.path, item.route));

//router.use('/user', userRoutes);
//router.use('/admin', AdminRoutes);


export default router;