import {
  addMinutes,
  addDays,
  add,
} from "date-fns";
import { TSchedule } from "./schedule.interface";
import prisma from "../../shared/prisma";

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



const getAllSchedulesService = async () => {
  const result = await prisma.schedule.findMany();
  return result;
}




export { createScheduleService, getAllSchedulesService };
