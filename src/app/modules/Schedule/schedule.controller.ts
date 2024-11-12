import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { ScheduleValidFields } from "./schedule.constant";
import { createScheduleService, deleteScheduleService, getAllSchedulesService, getSingleScheduleService } from "./schedule.service";


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
  const { email } = req.headers;
  const validatedQuery = pickValidFields(req.query, ScheduleValidFields)
  const result = await getAllSchedulesService(email as string, validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedules are retrieved successfully",
    meta: result.meta,
    data: result.data
  })
})



const getSingleSchedule = catchAsync(async (req, res) => {
  const { scheduleId } = req.params;
  const result = await getSingleScheduleService(scheduleId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule is retrieved successfully",
    data: result,
  });

})


const deleteSchedule = catchAsync(async (req, res) => {
  const { scheduleId } = req.params;
  const result = await deleteScheduleService(scheduleId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule is deleted successfully",
    data: result,
  });

})



export const ScheduleController = {
   createSchedule,
   getAllSchedules,
   getSingleSchedule,
   deleteSchedule
}
