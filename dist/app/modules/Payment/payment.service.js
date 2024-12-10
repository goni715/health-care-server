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
exports.validatePaymentService = exports.paymentSuccessService = exports.initPaymentService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const client_1 = require("@prisma/client");
const initPaymentService = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const paymentData = yield prisma_1.default.payment.findUnique({
        where: {
            appointmentId
        },
        include: {
            appointment: {
                include: {
                    patient: true
                }
            }
        }
    });
    //check paymentData does not exist
    if (!paymentData) {
        throw new ApiError_1.default(404, 'appointmentId does not exist');
    }
    //sslcommerz-initialation-data
    const data = {
        store_id: config_1.default.store_id,
        store_passwd: config_1.default.store_passwd,
        total_amount: paymentData.amount,
        currency: 'BDT',
        tran_id: paymentData.transactionId, // use unique tran_id for each api call
        success_url: config_1.default.success_url + paymentData.transactionId,
        fail_url: config_1.default.fail_url,
        cancel_url: config_1.default.cancel_url,
        ipn_url: 'http://localhost:3030/ipn', //optional
        shipping_method: 'N/A', //not applicable
        product_name: 'Appointment.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: paymentData.appointment.patient.name,
        cus_email: paymentData.appointment.patient.email,
        cus_add1: paymentData.appointment.patient.address,
        cus_add2: 'N/A',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: paymentData.appointment.patient.contactNumber,
        cus_fax: '01711111111',
        ship_name: 'N/A',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    //ssl-initialize
    const response = yield (0, axios_1.default)({
        method: 'post',
        url: config_1.default.ssl_payment_api,
        data: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    if (!((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.GatewayPageURL)) {
        throw new ApiError_1.default(400, 'Payment Error Occured');
    }
    return {
        paymentUrl: response.data.GatewayPageURL
    };
});
exports.initPaymentService = initPaymentService;
//sslcommerz ipn listener query
// amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=progr6733a65cce84c&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=01120da945a35710e8d21cc0333f6976&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id
const validatePaymentService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!query || !query.status || query.status !== "VALID") {
        throw new ApiError_1.default(400, 'Invalid Payment');
    }
    //Validate after successful transaction (inside success and ipn controller methods)
    //sslcommerz validation 
    const response = yield (0, axios_1.default)({
        method: 'GET',
        url: `${config_1.default.ssl_validation_api}?val_id=${query.val_id}&store_id=${config_1.default.store_id}&store_passwd=${config_1.default.store_passwd}&format=json`
    });
    //check if status is not VALID
    if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.status) !== "VALID") {
        throw new ApiError_1.default(400, "Payment Failled");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01 update payment
        const updatedPayment = yield tx.payment.update({
            where: {
                transactionId: query.tran_id, //or response.data.tran_id
            },
            data: {
                status: "PAID",
                paymentGatewayData: response.data
            },
        });
        //query-01 update appointment
        yield tx.appointment.update({
            where: {
                id: updatedPayment.appointmentId,
            },
            data: {
                paymentStatus: "PAID",
            },
        });
        return updatedPayment;
    }));
    return result;
});
exports.validatePaymentService = validatePaymentService;
const paymentSuccessService = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01 update payment
        const updatedPayment = yield tx.payment.update({
            where: {
                transactionId: transactionId
            },
            data: {
                status: client_1.PaymentStatus.PAID
            },
        });
        //query-01 update appointment
        yield tx.appointment.update({
            where: {
                id: updatedPayment.appointmentId,
            },
            data: {
                paymentStatus: "PAID",
            },
        });
        return updatedPayment;
    }));
    return result;
});
exports.paymentSuccessService = paymentSuccessService;
