import {
  addMinutes,
  addDays,
  add,
} from "date-fns";
import { TSchedule, TScheduleQuery } from "./schedule.interface";
import prisma from "../../shared/prisma";
import { calculatePaginationSorting } from "../../helper/QueryBuilder";
import ApiError from "../../errors/ApiError";

const createScheduleService = async (payload: TSchedule) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const intervalTime = 30; //30 minutes
  const schedules = [];

  let currentDate = new Date(startDate); //2024-10-24T00:00:00.000Z
  const endDateObj = new Date(endDate);


  //const AddHours = addHours(StartDate, 5); //2024-10-24T05:00:00.000Z
  //const AddMinutes = addMinutes(StartDate, 30); // 2024-10-24T00:30:00.000Z


  while (currentDate <= endDateObj) {
   
    let currentDateStartDateTime = add(
      currentDate,
      {
        hours: Number(startTime.split(':')[0]),
        minutes: Number(startTime.split(':')[1])
      }
    );

    const currentDateEndDateTime = add(
      currentDate,
      {
        hours: Number(endTime.split(':')[0]),
        minutes: Number(endTime.split(':')[1])
      }
    );

    // Create slots for the current day
    //create schedule slot after 30 minutes interval
    while (currentDateStartDateTime < currentDateEndDateTime) {
      const scheduleData = {
        startDateTime: currentDateStartDateTime,
        endDateTime: addMinutes(currentDateStartDateTime, intervalTime),
      };


      const existingSchedule = await prisma.schedule.findFirst({
        where: {
            startDateTime: scheduleData.startDateTime,
            endDateTime: scheduleData.endDateTime
        }
      })

      //if startDateTime & endDateTime does not exist
      if(!existingSchedule){
        schedules.push(scheduleData);
      }

      // const result = await prisma.schedule.create({
      //   data: scheduleData,
      // });
    

      currentDateStartDateTime = addMinutes(currentDateStartDateTime, intervalTime); //Move to the next 30-minute slot
    }

    // Move to the next day
    currentDate = addDays(currentDate, 1);
  }


  //create-schedule
   const result = await prisma.schedule.createMany({
     data: schedules
   }); 


  return result;
};



const getAllSchedulesService = async (email:string, query: TScheduleQuery) => {
  const { page, limit, sortBy, sortOrder, startDate, endDate, ...filters } = query;


  // Apply additional filters- filter-condition for specific field
  let filterQuery;
  if (startDate && endDate) {
    filterQuery = [
      {
        startDateTime: {
          gte: startDate
        }
      },
      {
        endDateTime: {
          lte: endDate
        }
      }
    ]
  }



  // Calculate pagination values & sorting
  const pagination = calculatePaginationSorting({ page, limit, sortBy, sortOrder });


  //doctor schedules for current doctor
const doctorSchedules = await prisma.doctorSchedules.findMany({
  where: {
    doctor: {
      email: email
    }
  }
})

 const doctorScheduleIds = doctorSchedules.map((item)=> item.scheduleId);

  const result = await prisma.schedule.findMany({
    where: {
      AND: filterQuery,
      id:{
        notIn: doctorScheduleIds
      }
    },
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: {
      [pagination.sortBy]: pagination.sortOrder,
    }
  });




  // Count total with matching the criteria
  const total = await prisma.schedule.count({
    where: {
      AND: filterQuery,
      id:{
        notIn: doctorScheduleIds
      }
    }
  });

  return {
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
      total,
    },
    data: result,
  };

}


const getSingleScheduleService = async (scheduleId: string) => {
  const result = await prisma.schedule.findUnique({
    where: {
      id: scheduleId,
    },
  });

  if (!result) {
    throw new ApiError(404, "This scheduleId does not exist");
  }

  return result;
};



const deleteScheduleService = async(scheduleId: string) => {
  const scheduleExist = await prisma.schedule.findUnique({
    where: {
      id: scheduleId
    }
  });

  if(!scheduleExist){
    throw new ApiError(404, 'scheduleId does not exist')
  }


  const doctorScedules = await prisma.doctorSchedules.findMany({
    where: {
      scheduleId
    }
  })

  if(doctorScedules.length > 0){
    throw new ApiError(409, 'This scheduleId is associated with doctorSchedule');
  }



  const result = await prisma.schedule.delete({
    where: {
      id: scheduleId
    }
  })


  return result;

}



export { 
  createScheduleService,
  getAllSchedulesService,
  getSingleScheduleService,
  deleteScheduleService 
};
