import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { DoctorScheduleValidFields } from "./doctorSchedule.constant";
import { createDoctorScheduleService, deleteMyScheduleService, getMySchedulesService } from "./doctorSchedule.service";


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




const getMySchedules = catchAsync(async (req, res) => {
  const { email } = req.headers;
  const validatedQuery = pickValidFields(req.query, DoctorScheduleValidFields)
  const result = await getMySchedulesService(email as string, validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor Schedules are retrieved successfully",
    meta: result.meta,
    data: result.data
  })
})




const deleteMySchedule = catchAsync(async (req, res) => {
  const { email } = req.headers;
  const { scheduleId } = req.params;
  const result = await deleteMyScheduleService(email as string, scheduleId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My schedule deleted successfully",
    data: result,
  });

})


export const DoctorScheduleController = {
  createDoctorSchedule,
  getMySchedules,
  deleteMySchedule
}
