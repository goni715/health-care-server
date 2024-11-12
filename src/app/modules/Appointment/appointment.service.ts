import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { TAppointment } from "./appointment.interface";
import { v4 as uuidv4 } from 'uuid';


const createAppointmentService = async (email: string, payload:TAppointment) => {
  const patientExist = await prisma.patient.findUnique({
    where: {
      email,
    }
  });

  //check if patient does not exist
  if (!patientExist) {
    throw new ApiError(404, "Patient does not exist");
  }

  //set patientId
  payload.patientId= patientExist.id;

  //set videoCalling
  payload.videoCallingId=uuidv4();



  const doctorExist = await prisma.doctor.findUnique({
    where: {
      id: payload.doctorId
    }
  });

 // check if doctor does not exist
  if (!doctorExist) {
    throw new ApiError(404, "doctorId does not exist");
  }


  const scheduleExist = await prisma.schedule.findUnique({
    where: {
      id: payload.scheduleId
    }
  });

  //check if schedule does not exist
  if (!scheduleExist) {
    throw new ApiError(404, "scheduleId does not exist");
  }



  const doctorScheduleExist = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: payload.doctorId,
        scheduleId: payload.scheduleId,
      }
    }
  });

  //check if doctorSchedule does not Exist
  if(!doctorScheduleExist){
    throw new ApiError(404, "DoctorSchedule does not exist by the combination of this scheduleId & doctorId");
  }

   //check if doctorSchedule is already booked
   if(doctorScheduleExist.isBooked){
    throw new ApiError(403, `This doctorSchedule is already booked`);
   }




  const result = await prisma.$transaction(async (tx) => {
    //query-01 createAppointment
    const createdAppointmentData = await tx.appointment.create({
        data: payload
    })

    //query-02 update doctorSchedule
    await tx.doctorSchedules.update({
        where: {
            doctorId_scheduleId: {
              doctorId: payload.doctorId,
              scheduleId: payload.scheduleId,
            }
          },
        data: {
            isBooked: true,
            appointmentId: createdAppointmentData.id
        }
    })

    return createdAppointmentData;

  })


  return result;
}


export {
    createAppointmentService
}