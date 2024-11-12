import ApiError from "../../errors/ApiError";
import { calculatePaginationSorting } from "../../helper/QueryBuilder";
import prisma from "../../shared/prisma";
import { TDoctorScheduleQuery } from "./doctorSchedule.constant";




const createDoctorScheduleService = async(email: string, payload: TDoctorSchedule) => {
    const { schedules } = payload;
    const doctorExist = await prisma.doctor.findFirst({
        where: {
            email
        }
    })


    //check if doctorId does not exist
    if(!doctorExist) {
        throw new ApiError(404, "doctorId does not exist");
    }



    const dataArr = schedules?.map((item)=> ({
        doctorId: doctorExist.id,
        scheduleId : item
    }))


    const schedulesDataArr: any[] = [];

   for(const item of dataArr){
        const doctorScheduleExist = await prisma.doctorSchedules.findMany({
            where: {
                doctorId: item.doctorId,
                scheduleId: item.scheduleId
            }
        })

        //check doctorId & scheduleId is already existed
        if(doctorScheduleExist.length === 0){
            schedulesDataArr.push(item)
        }
    }
    

    const result = await prisma.doctorSchedules.createMany({
        data: schedulesDataArr
    })
    
    return result;
}

const getMySchedulesService = async (email:string, query:TDoctorScheduleQuery) => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    isBooked,
    ...filters
  } = query;

  let filterQuery: any[] = [
    {
      doctor: {
        email: email,
      },
    },
  ];

  if (startDate && endDate) {
    filterQuery.push({
      schedule: {
        AND: [
          {
            startDateTime: {
              gte: startDate,
            },
          },
          {
            endDateTime: {
              lte: endDate,
            },
          },
        ],
      },
    });
  }


  if(isBooked){
    filterQuery.push({
      isBooked: isBooked ==="true" ? true : false
    })
  }


  //console.dir(filterQuery, {depth: Infinity});


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

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip: pagination.skip,
    take: pagination.limit,
    include: {
      schedule: true
    }
  });

  // Count total with matching the criteria
  const total = await prisma.doctorSchedules.count({
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

const getAllDoctorSchedulesService = async (query:TDoctorScheduleQuery) => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    isBooked,
    ...filters
  } = query;

  let filterQuery: any[] = [];

  if (startDate && endDate) {
    filterQuery.push({
      schedule: {
        AND: [
          {
            startDateTime: {
              gte: startDate,
            },
          },
          {
            endDateTime: {
              lte: endDate,
            },
          },
        ],
      },
    });
  }


  if(isBooked){
    filterQuery.push({
      isBooked: isBooked ==="true" ? true : false
    })
  }


  //console.dir(filterQuery, {depth: Infinity});


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

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip: pagination.skip,
    take: pagination.limit,
    include: {
      schedule: true,
      doctor:true
    }
  });

  // Count total with matching the criteria
  const total = await prisma.doctorSchedules.count({
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
  
const deleteMyScheduleService = async (email: string, scheduleId: string) => {
  const doctorExist = await prisma.doctor.findUnique({
    where: {
      email
    },
  });

   //check if doctorId does not exist
   if(!doctorExist) {
    throw new ApiError(404, "doctorId does not exist");
   }

   const isBookedSchedule = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorExist?.id,
        scheduleId: scheduleId
      },
      isBooked: true
    }
   })


   if(isBookedSchedule){
    throw new ApiError(403, 'Failled to delete, This schedule is already booked');
   }


  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorExist?.id,
        scheduleId: scheduleId
      }
    } 
  })


  return result;
}


export {
    createDoctorScheduleService,
    getMySchedulesService,
    getAllDoctorSchedulesService,
    deleteMyScheduleService
}