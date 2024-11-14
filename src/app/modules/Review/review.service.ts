import { Review } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";



const createReviewService = async (email:string, payload:Review)=> {

    const appointmentExist = await prisma.appointment.findUnique({
      where: {
        id: payload.appointmentId,
      },
      include: {
        patient: true,
      },
    });
  
    //check if appointmentId does not exist
    if (!appointmentExist) {
      throw new ApiError(404, "This appointmentId does not exist");
    }
  
    if (appointmentExist.patient.email !== email) {
      throw new ApiError(400, "This is not your Appointment");
    }
  
  
  
    const reviewExist = await prisma.review.findUnique({
      where: {
        appointmentId: payload.appointmentId,
      },
    });
  
    if (reviewExist) {
      throw new ApiError(
        409,
        "You have already prvided a review"
      );
    }
  
    //set doctorId & patientId
    payload.doctorId = appointmentExist.doctorId;
    payload.patientId = appointmentExist.patientId;

    

    const result = await prisma.$transaction(async (tx) => {
      //query-01 create-review
      const createdReview = await tx.review.create({
        data: payload,
      });

      //query-03 find doctorAllReviews
      const doctorAllReviews = await tx.review.findMany({
        where: {
          doctorId: appointmentExist.doctorId,
        },
      });

      const totalRating = doctorAllReviews?.map((item) => item.rating)
                                           .reduce((acc, cv) => acc + cv, 0);
      const averageRating = totalRating / doctorAllReviews.length;


      //query-03 update doctor
      await tx.doctor.update({
        where: {
            id: appointmentExist.doctorId
        },
        data: {
            averageRating: averageRating
        }
      })


      return createdReview;


    });


    return result
  };


export {
    createReviewService
}