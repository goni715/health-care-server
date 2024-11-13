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


// amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=progr6733a65cce84c&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=01120da945a35710e8d21cc0333f6976&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id

const validatePaymentService = async (query:any) => {
    if(!query || !query.status || query.status !=="VALID"){
        throw new ApiError(400, 'Invalid Payment')
    }


    //Validate after successful transaction (inside success and ipn controller methods)
    //sslcommerz validation 
    const response = await axios ({
        method: 'GET',
        url: `${config.ssl_validation_api}?val_id=${query.val_id}&store_id=${config.store_id}&store_passwd=${config.store_passwd}&format=json`
    })

    //check if status is not VALID
    if(response?.data?.status !== "VALID") {
      throw new ApiError(400, "Payment Failled");
    }


    const result = await prisma.$transaction(async (tx) => {
      //query-01 update payment
      const updatedPayment = await tx.payment.update({
        where: {
          transactionId: query.tran_id,  //or response.data.tran_id
        },
        data: {
          status: "PAID",
          paymentGatewayData:response.data
        },
      });

      //query-01 update appointment
      await tx.appointment.update({
        where: {
          id: updatedPayment.appointmentId,
        },
        data: {
          paymentStatus: "PAID",
        },
      });

      return updatedPayment;
    })
    


  return result;
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
    paymentSuccessService,
    validatePaymentService
}