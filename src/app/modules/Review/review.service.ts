import { Review } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { calculatePaginationSorting, makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { ReviewSearchableFields } from "./review.constant";



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

    
      //query-02 find averageRating
      const average = await tx.review.aggregate({
        _avg: {
          rating: true
        },
        where: {
          doctorId: appointmentExist.doctorId
        }
      })


      //query-03 update doctor
      await tx.doctor.update({
        where: {
            id: appointmentExist.doctorId
        },
        data: {
            averageRating: average._avg.rating as number
        }
      })


      return createdReview
    });


    return result;
};


const getAllReviewsService = async (query: any) => {
    const { searchTerm, page, limit, sortBy, sortOrder, ...filters } = query;
  
    let searchQuery;
    if (searchTerm) {
      searchQuery = [
        {
          patient: {
            OR: makeSearchQuery(ReviewSearchableFields, searchTerm),
          },
        },
        {
          doctor: {
            OR: makeSearchQuery(ReviewSearchableFields, searchTerm),
          },
        },
      ];
    }
  

  
    // Build the 'where' clause based on search and filter
    const whereConditions: any = {
      OR: searchQuery,
    };
  
    //console.dir(whereConditions, {depth: Infinity});
  
    // Calculate pagination values & sorting
    const pagination = calculatePaginationSorting({
      page,
      limit,
      sortBy,
      sortOrder,
    });
  
    const result = await prisma.review.findMany({
      where: whereConditions,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: {
        [pagination.sortBy]: pagination.sortOrder,
      },
      include: {
        doctor: true,
        patient: true,
      },
    });
  
    // Count total with matching the criteria
    const total = await prisma.review.count({
      where: whereConditions,
    });
  
    return {
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
        total,
      },
      data: result,
    };
};
  

export {
    createReviewService,
    getAllReviewsService
}