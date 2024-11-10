import { PatientHealthData } from "@prisma/client"
import prisma from "../../shared/prisma"
import ApiError from './../../errors/ApiError';



const createPatientHealthDataService = async(payload: PatientHealthData) => {

    //const { patientId } = payload;
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



    const dataExist = await prisma.patientHealthData.findUnique({
        where: {
            patientId: patientId
        }
    })

    //if patientId is exist on patientHealthData
    if(dataExist){
        throw new ApiError(409, 'patientId is already exist');
    }

    //create patient-health-data
    const result = await prisma.patientHealthData.create({
        data: payload
    })

    return result
}



const updatePatientHealthDataService = async(patientId:string, payload: PatientHealthData) => {
  
    const patientExist = await prisma.patientHealthData.findUnique({
        where: {
            patientId: patientId
        }
    })
  
    //check id is not exist
    if (!patientExist) {
      throw new ApiError(404, "patientId does not exist");
    }
  
     //update patientHealthData
    const result = await prisma.patientHealthData.update({
      where: {
        patientId
      },
      data: payload
    });
  
  
    return result;
  }
  



export {
    createPatientHealthDataService,
    updatePatientHealthDataService
}