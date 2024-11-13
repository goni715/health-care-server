import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { initPaymentService } from "./payment.service";


const initPaymentt = catchAsync(async (req, res) => {
  const result = await initPaymentService();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Initialized successfully",
    data: result,
  });
});
  


export const PaymentController = {
    initPaymentt
}