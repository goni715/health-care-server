import ApiError from "../../errors/ApiError";
import { calculatePaginationSorting } from "../../helper/QueryBuilder";
import prisma from "../../shared/prisma";




const createDoctorScheduleService = async(email: string, payload: TDoctorSchedule) => {
    const { schedules } = payload;
    const doctorExist = await prisma.doctor.findFirst({
        where: {
            email
        }
    })


    //check if doctorId does not exist
    if(!doctorExist) {
        throw new ApiError(404, "doctorId does not exist");
    }



    const dataArr = schedules?.map((item)=> ({
        doctorId: doctorExist.id,
        scheduleId : item
    }))


    const schedulesDataArr: any[] = [];

   for(const item of dataArr){
        const doctorScheduleExist = await prisma.doctorSchedules.findMany({
            where: {
                doctorId: item.doctorId,
                scheduleId: item.scheduleId
            }
        })

        //check doctorId & scheduleId is already existed
        if(doctorScheduleExist.length === 0){
            schedulesDataArr.push(item)
        }
    }
    

    const result = await prisma.doctorSchedules.createMany({
        data: schedulesDataArr
    })
    
    return result;
}


const getDoctorSchedulesService = async (email:string, query:any) => {
    const { page, limit, sortBy, sortOrder, startDate, endDate, ...filters } = query;
    console.log(email);
  
  
    // Apply additional filters- filter-condition for specific field
    let filterQuery;
    if (startDate && endDate) {
      filterQuery = [
        {
          startDateTime: {
            gte: startDate
          }
        },
        {
          endDateTime: {
            lte: endDate
          }
        }
      ]
    }


      // Build the 'where' clause based on search and filter
  const whereConditions: any = {
    AND: filterQuery,
  };
  
  
  
    // Calculate pagination values & sorting
    const pagination = calculatePaginationSorting({ page, limit, sortBy, sortOrder });
  
  
  
    const result = await prisma.doctorSchedules.findMany({
      where: {
        AND: [
          // {
          //   doctor : {
          //     email: email
          //   }
          // },
          // {
          //   schedule: {
          //     AND: [
          //       {
          //         startDateTime: {
          //           gte: startDate
          //         }
          //       },
          //       {
          //         endDateTime: {
          //           gte: endDate
          //         }
          //       }
          //     ]
          //   }
          // }
        ]
      },
      skip: pagination.skip,
      take: pagination.limit,
      // orderBy: {
      //   [pagination.sortBy]: pagination.sortOrder,
      // }
    });
  
  
  
  
    // Count total with matching the criteria
    // const total = await prisma.schedule.count({
    //   where: {
    //     AND: filterQuery,
    //     id:{
    //       notIn: doctorScheduleIds
    //     }
    //   }
    // });
  
    return {
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(40 / pagination.limit),
        total:40,
      },
      data: result,
    };
  
  }
  
  


export {
    createDoctorScheduleService,
    getDoctorSchedulesService
}