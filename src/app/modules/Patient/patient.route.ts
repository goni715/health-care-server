import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { PatientController } from './patient.controller';


const router = express.Router();



router.get('/get-all-patients', AuthMiddleware("admin", 'super_admin', 'doctor'), PatientController.getAllPatients);


export const PatientRoutes = router;