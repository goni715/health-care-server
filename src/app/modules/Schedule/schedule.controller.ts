import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { ScheduleValidFields } from "./schedule.constant";
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
  const validatedQuery = pickValidFields(req.query, ScheduleValidFields)
  const result = await getAllSchedulesService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedules are retrieved successfully",
    meta: result.meta,
    data: result.data
  })
})






export const ScheduleController = {
   createSchedule,
   getAllSchedules
}
