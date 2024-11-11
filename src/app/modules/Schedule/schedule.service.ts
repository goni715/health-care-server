import { addHours, addMinutes, isBefore, parseISO, format, addDays } from "date-fns";
import { TSchedule } from "./schedule.interface";


const createScheduleService = async (payload: TSchedule) => {
    const { startDate, endDate, startTime, endTime } = payload;

    const StartDate = new Date(startDate); //2024-10-24T00:00:00.000Z
    const EndDate = new Date(endDate);
    const intervalTime = 30; //30 minutes
    const results = []
   

    //const AddHours = addHours(StartDate, 5); //2024-10-24T05:00:00.000Z
    //const AddMinutes = addMinutes(StartDate, 30); // 2024-10-24T00:30:00.000Z
    //const startDateTime = addHours(StartDate, Number(startTime.split(':')[0]));
    //console.log( addMinutes(startDateTime, 30));

    while(StartDate <= EndDate){
        const startDateTime = addHours(StartDate, Number(startTime.split(':')[0]))
        const endDateTime = addHours(EndDate, Number(endTime.split(':')[0]))

        // Create slots for the current day
        //create schedule slot after 30 minutes interval
        while(startDateTime < endDateTime){
            const scheduleData = {
                startDateTime: startDateTime,
                endDateTime: addMinutes(startDateTime, intervalTime) 
            }
            startDateTime.setMinutes(startDateTime.getMinutes()+ intervalTime) //Move to the next 30-minute slot
        }
    }

    return {
        StartDate,
        EndDate
    };




}


export {
    createScheduleService
}