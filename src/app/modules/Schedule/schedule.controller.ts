import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createScheduleService } from "./schedule.service";


const createSchedule = catchAsync(async (req, res) => {
  const result = await createScheduleService(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule is created successfully",
    data: result,
  });
});






export const ScheduleController = {
   createSchedule
}
