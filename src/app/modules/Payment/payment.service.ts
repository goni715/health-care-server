import axios from "axios";
import config from "../../config";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";


const initPaymentService = async (appointmentId: string) => {

    const paymentData = await prisma.payment.findUnique({
        where: {
            appointmentId
        },
        include:{
            appointment: {
                include: {
                    patient: true
                }
            }
        }
    });

    //check paymentData does not exist
    if(!paymentData){
        throw new ApiError(404, 'appointmentId does not exist')
    }

    //sslcommerz-initialation-data
    const data = {
        store_id: config.store_id,
        store_passwd: config.store_passwd,
        total_amount: paymentData.amount,
        currency: 'BDT',
        tran_id: paymentData.transactionId, // use unique tran_id for each api call
        success_url: config.success_url+appointmentId,
        fail_url: config.fail_url,
        cancel_url: config.cancel_url,
        ipn_url: 'http://localhost:3030/ipn',//optional
        shipping_method: 'N/A',//not applicable
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
    const response = await axios ({
        method: 'post',
        url: config.ssl_payment_api,
        data: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })


    if(!response?.data?.GatewayPageURL){
        throw new ApiError(400, 'Payment Error Occured')
    }
    

    return {
        paymentUrl : response.data.GatewayPageURL
    }
}


const paymentSuccessService = async (appointmentId: string) => {
    const apppointmentExist = await prisma.appointment.findUnique({
        where: {
            id: appointmentId
        }
    })


  //check if appointment does not exist
  if (!apppointmentExist) {
    throw new ApiError(404, "appointmentId does not exist");
  }


  const result = await prisma.$transaction(async (tx) => {
    //query-01 update appointment
    await tx.appointment.update({
       where:{
        id: appointmentId
       },
       data: {
        paymentStatus: 'PAID'
       }
    })

    //query-02 update payment
    const updatedPayment = await tx.payment.update({
        where:{
          appointmentId: appointmentId
        },
        data: {
         status: 'PAID'
        }
     })

     return updatedPayment;


  })

   
    return result;
}


export {
    initPaymentService,
    paymentSuccessService
}