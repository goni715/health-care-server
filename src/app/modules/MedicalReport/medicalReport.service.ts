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
        throw new ApiError(404, 'patientId does not exist');
    }


    const result = await prisma.medicalReport.create({
        data: payload
    })


    return result;
}




const deleteMedicalReportService = async (patientId: string, reportId: string) => {

    const patient = await prisma.patient.findUnique({
      where: {
        id:patientId,
        isDeleted: false,
      },
    });
  
    //if id is not exist
    if(!patient){
      throw new ApiError(404, "patientId does not exist");
    }

   
    
    const report = await prisma.medicalReport.findUnique({
        where: {
            id: reportId
        },
      });
    
      //if id is not exist
      if(!report){
        throw new ApiError(404, "reportId does not exist");
      }
  

    const result = await prisma.medicalReport.delete({
        where: {
            id:reportId,
            patientId
        }
    })

    return result;
    
  };
  
  
  


export{
    createMedicalReportService,
    deleteMedicalReportService
}