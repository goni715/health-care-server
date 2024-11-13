import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { initPaymentService } from "./payment.service";


const initPayment = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const result = await initPaymentService(appointmentId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Initialized successfully",
    data: result,
  });
});
  



const initPaymentt = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const result = await initPaymentService(appointmentId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Initialized successfully",
    data: result,
  });
});
  



export const PaymentController = {
    initPayment
}