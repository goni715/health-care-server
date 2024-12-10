"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
const initPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { appointmentId } = req.params;
    const result = yield (0, payment_service_1.initPaymentService)(appointmentId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payment Initialized successfully",
        data: result,
    });
}));
const validatePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, payment_service_1.validatePaymentService)(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payment Success || Validate payment successfully",
        data: result,
    });
}));
const paymentSuccess = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.params;
    const result = yield (0, payment_service_1.paymentSuccessService)(transactionId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payment Success",
        data: result,
    });
}));
const paymentFail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payment Failled",
        data: {
            message: 'Ooops.. Failled to payment'
        }
    });
    //res.redirect("https://mern-ecommerce-goni.netlify.app/#/payment/fail/"+req.params.tranId);
}));
const paymentCancel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payment Canceled Successfully",
        data: {
            message: 'Payment cancelled'
        }
    });
}));
exports.PaymentController = {
    initPayment,
    validatePayment,
    paymentSuccess,
    paymentFail,
    paymentCancel
};
