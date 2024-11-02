import express from 'express';
import { adminController } from './admin.controller';


const router = express.Router();

router.get('/get-all-admins', adminController.getAllAdmins);
router.get('/get-single-admin/:id', adminController.getSingleAdmin);
router.patch('/update-admin/:id', adminController.updateAdmin);
router.delete('/delete-admin/:id', adminController.deleteAdmin);
router.delete('/soft-delete-admin/:id', adminController.softDeleteAdmin);




export const AdminRoutes = router;