import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createDoctorScheduleService } from "./doctorSchedule.service";


const createDoctorSchedule = catchAsync(async (req, res) => {
 const { email } = req.headers; 
 const result = await createDoctorScheduleService(email as string, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor Schedules created successfully",
    data: result,
  });
});


export const DoctorScheduleController = {
  createDoctorSchedule
}
