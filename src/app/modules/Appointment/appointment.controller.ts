import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createAppointmentService } from "./appointment.service";



const createAppointment = catchAsync(async (req, res) => {
    const { email } = req.headers;
    const result = await createAppointmentService(email as string, req.body);

     sendResponse(res, {
       statusCode: 201,
       success: true,
       message: "Appointment Booked successfully",
       data: result,
     });
   });



export const AppointmentController = {
    createAppointment
}