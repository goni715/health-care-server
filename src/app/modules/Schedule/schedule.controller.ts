import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createScheduleService, getAllSchedulesService } from "./schedule.service";


const createSchedule = catchAsync(async (req, res) => {
  const result = await createScheduleService(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedules created successfully",
    data: result,
  });
});


const getAllSchedules = catchAsync(async (req, res) => {
  //const result = await getAllSpecialtiesService(validatedQuery);
  const result = await getAllSchedulesService();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedules are retrieved successfully",
    data: result
  })
})






export const ScheduleController = {
   createSchedule,
   getAllSchedules
}
