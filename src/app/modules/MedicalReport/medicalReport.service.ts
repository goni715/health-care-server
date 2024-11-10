import { MedicalReport } from "@prisma/client";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";


const createMedicalReportService = async (payload: MedicalReport) => {
    const patientId = payload.patientId;

    const patientExist = await prisma.patient.findUnique({
        where: {
            id: patientId
        }
    })
    
     //check patientId does not exist
     if(!patientExist){
        throw new ApiError(409, 'patientId does not exist');
    }


    const result = await prisma.medicalReport.create({
        data: payload
    })


    return result;
}




export{
    createMedicalReportService
}