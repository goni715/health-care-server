import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

const createPrescriptionService = async(email: string, payload:Prescription) => {

    const appointmentExist = await prisma.appointment.findUnique({
        where: {
          id: payload.appointmentId,
        },
        include:{
            doctor: true
        }
      });
    
      //check if appointmentId does not exist
      if(!appointmentExist){
        throw new ApiError(404, 'This appointmentId does not exist');
      }


      if(appointmentExist.doctor.email !== email){
        throw new ApiError(404, 'This appointment does not belong to this doctor');
      }

       //check if appointmentStatus is not completed
       if(appointmentExist.status !== "COMPLETED"){
        throw new ApiError(400, 'This appointment is not completed');
       }

       if(appointmentExist.paymentStatus !== "PAID"){
         throw new ApiError(400, 'Payment is unpaid');
       }


      const prescriptionExist = await prisma.prescription.findUnique({
        where: {
          appointmentId:payload.appointmentId
        }
      })

      if(prescriptionExist){
        throw new ApiError(409, 'Prescription already exist with this appointmentId');
      }


      //set doctorId & patientId
      payload.doctorId=appointmentExist.doctorId;
      payload.patientId=appointmentExist.patientId;


      const result = await prisma.prescription.create({
        data: payload
      })
    

    return result;
}




export {
    createPrescriptionService
}