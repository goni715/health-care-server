import {
  addHours,
  addMinutes,
  isBefore,
  parseISO,
  format,
  addDays,
} from "date-fns";
import { TSchedule } from "./schedule.interface";
import prisma from "../../shared/prisma";

const createScheduleService = async (payload: TSchedule) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const start = new Date(startDate); //2024-10-24T00:00:00.000Z
  const end = new Date(endDate);
  const intervalTime = 30; //30 minutes
  const results = [];

  let currentDate = new Date(startDate);
  //console.log(currentDate);
  const endDateObj = new Date(endDate);
  //console.log(endDateObj);
  //console.log(new Date(`${format(currentDate, 'yyyy-MM-dd')}T${startTime}:00`));
  //console.log(addHours(currentDate, Number(startTime.split(':')[0])));

  //const AddHours = addHours(StartDate, 5); //2024-10-24T05:00:00.000Z
  //const AddMinutes = addMinutes(StartDate, 30); // 2024-10-24T00:30:00.000Z
  //const startDateTime = addHours(StartDate, Number(startTime.split(':')[0]));
  //console.log( addMinutes(startDateTime, 30));

  while (currentDate <= endDateObj) {
    // const currentDateStartDateTime = addHours(currentDate, Number(startTime.split(':')[0]))
    // const currentDateEndDateTime = addHours(currentDate, Number(endTime.split(':')[0]))
    const currentDateStartDateTime = addHours(
      currentDate,
      Number(startTime.split(":")[0])
    );

    const currentDateEndDateTime = addHours(
      currentDate,
      Number(endTime.split(":")[0])
    );

    // Create slots for the current day
    //create schedule slot after 30 minutes interval
    while (currentDateStartDateTime < currentDateEndDateTime) {

      const scheduleData = {
          startDateTime: currentDateStartDateTime,
          endDateTime: addMinutes(currentDateStartDateTime, intervalTime)
      }
      const result = await prisma.schedule.create({
        data: scheduleData
      })
      results.push(result)
     

      currentDateStartDateTime.setMinutes( currentDateStartDateTime.getMinutes() + intervalTime); //Move to the next 30-minute slot
    }

    // Move to the next day
    currentDate = addDays(currentDate, 1);
  }


  return results;
};

export { createScheduleService };
