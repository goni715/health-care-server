import express from 'express';
import { adminController } from './admin.controller';


const router = express.Router();

router.get('/get-all-admins', adminController.getAllAdmins);




export const AdminRoutes = router;