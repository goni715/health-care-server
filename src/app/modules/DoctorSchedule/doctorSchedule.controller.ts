import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { DoctorScheduleValidFields } from "./doctorSchedule.constant";
import { createDoctorScheduleService, getDoctorSchedulesService } from "./doctorSchedule.service";


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




const getDoctorSchedules = catchAsync(async (req, res) => {
  const { email } = req.headers;
  const validatedQuery = pickValidFields(req.query, DoctorScheduleValidFields)
  const result = await getDoctorSchedulesService(email as string, validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor Schedules are retrieved successfully",
    meta: result.meta,
    data: result.data
  })
})



export const DoctorScheduleController = {
  createDoctorSchedule,
  getDoctorSchedules
}
