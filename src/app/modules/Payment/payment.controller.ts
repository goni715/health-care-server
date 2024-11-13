import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { initPaymentService, paymentSuccessService, validatePaymentService } from "./payment.service";


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
  


const validatePayment = catchAsync(async (req, res) => {
  const result = await validatePaymentService(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Success || Validate payment successfully",
    data: result,
  });
});


const paymentSuccess = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  const result = await paymentSuccessService(transactionId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Success",
    data: result,
  });
});
  




const paymentFail = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Failled",
    data: {
      message: 'Ooops.. Failled to payment'
    }
  });

  //res.redirect("https://mern-ecommerce-goni.netlify.app/#/payment/fail/"+req.params.tranId);
});




const paymentCancel = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Canceled Successfully",
    data: {
      message: 'Payment cancelled'
    }
  });
});



export const PaymentController = {
    initPayment,
    validatePayment,
    paymentSuccess,
    paymentFail,
    paymentCancel
}