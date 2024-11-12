import ApiError from "../../errors/ApiError";
import { calculatePaginationSorting, makeFilterQuery } from "../../helper/QueryBuilder";
import prisma from "../../shared/prisma";
import { TAppointment, TAppointmentQuery } from "./appointment.interface";
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



    //query-03 create payment
    await tx.payment.create({
      data: {
        appointmentId: createdAppointmentData.id,
        amount: doctorExist.appointmentFee,
        transactionId: 'ph-health-care-'+uuidv4()
      }
    })

    return createdAppointmentData;

  })


  return result;
}


const getMyAppointmentService = async (email:string, role: string, query: TAppointmentQuery) => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    ...filters
  } = query;


  
  let filterQuery: any[] = [];
  let includeFields;

  //if role is doctor
  if(role==="doctor"){
    filterQuery.push({
      doctor: {
        email,
      },
    });

    //set patient include fields
    includeFields = {
      patient: {
        include: {
          patientHealthData: true,
          medicalReport: true,
        },
      },
      schedule: true
    };
  }

  //if role is patient
  if(role==="patient"){
    filterQuery.push({
      patient: {
        email
      }
    })

   //set doctor include fields
    includeFields = {
      doctor: {
        include: {
          doctorSpecialties: {
            include: {
              specialties:true
            }
          }
        }
      },
      schedule: true
    }

    
  }



   // Apply additional filters- filter-condition for specific field
   if (Object.keys(filters).length > 0) {
     filterQuery.push(...makeFilterQuery(filters)) 
   }



  // Build the 'where' clause based on search and filter
  const whereConditions: any = {
    AND: filterQuery,
  };



  // Calculate pagination values & sorting
  const pagination = calculatePaginationSorting({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: {
      [pagination.sortBy]: pagination.sortOrder,
    },
    include: includeFields
  });

  // Count total with matching the criteria
  const total = await prisma.appointment.count({
    where: whereConditions
  });


  return {
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
      total
    },
    data: result,
  };
}


export {
    createAppointmentService,
    getMyAppointmentService
}