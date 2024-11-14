import { Doctor } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { calculatePaginationSorting } from "../../helper/QueryBuilder";
import prisma from "../../shared/prisma";
import { DoctorSearchableFields } from "./doctor.constant";
import { TDoctorQuery, TUpdateDoctor } from "./doctor.interface";

const getAllDoctorsService = async (query: TDoctorQuery) => {
  const { searchTerm, specialties, page, limit, sortBy, sortOrder, ...filters } = query;

  // Search if searchTerm is exist
  let searchQuery;
  if (query?.searchTerm) {
    searchQuery = DoctorSearchableFields.map((item) => ({
      [item]: {
        contains: query?.searchTerm,
        mode: "insensitive",
      },
    }));
  }

  // Apply additional filters- filter-condition for specific field
  let filterQuery: any[] = [];
  if (Object.keys(filters).length > 0) {
    filterQuery = Object.keys(filters).map((key) => ({
      [key]: {
        equals: (filters as any)[key],
      },
    }));
  }



 //filter relational field--
 //filter sepcialties
 if(specialties && specialties?.length >0){
  filterQuery = [
    ...filterQuery,
    {
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: 'insensitive'
            }
          }
        }
      }
    }
  ]
 }


  // Build the 'where' clause based on search and filter
  const whereConditions: any = {
    isDeleted: false,
    AND: filterQuery,
    OR: searchQuery,
  };

  // Calculate pagination values & sorting
  const pagination = calculatePaginationSorting({ page, limit, sortBy, sortOrder });

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: {
      [pagination.sortBy]: pagination.sortOrder,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true
        }
      }
    }
  });

  // Count total doctors matching the criteria
  const total = await prisma.doctor.count({
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



const getSingleDoctorService = async (id: string) => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if(!result){
    throw new ApiError(404, "id does not exist");
  }

  return result;
};



const deleteDoctorService = async (id: string): Promise<Doctor> => {

  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  //if id is not exist
  if(!doctor){
    throw new ApiError(404, "id does not exist");
  }


  const appointmentExist = await prisma.appointment.findMany({
    where: {
      doctorId:id
    },
  });

  //check if appointmentExist
  if(appointmentExist.length > 0){
    throw new ApiError(409, 'This doctorId is associated with Appointment');
  }
 


  const result = await prisma.$transaction(async (transactionClient) => {
    //query-01 delete doctorSpecialties
    await transactionClient.doctorSpecialties.deleteMany({
      where: {
        doctorId: id,
      },
    });

    //query-02 delete doctorSchedules
    await transactionClient.doctorSchedules.deleteMany({
      where: {
        doctorId: id,
      },
    });

    //query-03 doctor delete
    const doctorDeletedData = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    //query-04 delete-user
    await transactionClient.user.delete({
      where: {
        email: doctorDeletedData.email,
      },
    });

    return doctorDeletedData;
  });

  return result;
};




const softDeleteDoctorService = async (id: string): Promise<Doctor> => {
  //if id is not exist
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  //if id is not exist
  if(!doctor){
    throw new ApiError(404, "id does not exist");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    //query-01-dcotor-delete
    const doctorDeletedData = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    //query-02- delete-user
    await transactionClient.user.update({
      where: {
        email: doctorDeletedData.email,
      },
      data: {
        isDeleted: true,
      },
    });

    return doctorDeletedData;
  });

  return result;
};



const updateDoctorService = async(id:string, payload: TUpdateDoctor) => {
  const { specialties, ...doctorData } = payload;

  const doctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  //check id is not exist
  if (!doctorExist) {
    throw new ApiError(404, "Id does not exist");
  }


  
  //transaction started
  await prisma.$transaction(async (transactionClient) => {
    //query-01 update doctor
    await transactionClient.doctor.update({
      where: {
        id
      },
      data: doctorData
    });


      if(specialties && specialties.length > 0){
        const deleteSpecialtiesIds = specialties.filter(item => item.isDeleted).map(item => item.specialtiesId);
        //query-02
        //delete doctor specialties by specialties & doctor id
        if(deleteSpecialtiesIds.length > 0){
          for(const specialtiesId of deleteSpecialtiesIds){
            await transactionClient.doctorSpecialties.deleteMany({
              where: {
                doctorId: doctorExist.id,
                specialtiesId: specialtiesId
              }
            })
          }  
        }

        //query-02
        //second way for deleting multiple doctorSpecialties
        // if (deleteSpecialtiesIds.length > 0) {
        //   const deleteDoctorSpecialties = await transactionClient.doctorSpecialties.deleteMany({
        //     where: {
        //       doctorId: doctorExist.id,
        //       specialtiesId: { in: deleteSpecialtiesIds } // Match any value in the array
        //     }
        //   });
        // }
        




        //query-03
        //create doctorSpecialties using createMany method
        const dataArr = specialties.filter(item => !item.isDeleted).map(item => ({
          doctorId: doctorExist.id,
          specialtiesId: item.specialtiesId,
        }));

        if(dataArr.length > 0){
          //check doctorId & specialtiesId already exist
          const createSpecialtiesIds = specialties.filter(item => !item.isDeleted).map(item => item.specialtiesId);
          const doctorSpecialtiesExist = await transactionClient.doctorSpecialties.findMany({
                where: {
                  doctorId: doctorExist.id,
                  specialtiesId: { in: createSpecialtiesIds } // Match any value in the array
                }
          });


          if (doctorSpecialtiesExist.length === 0) {
            await transactionClient.doctorSpecialties.createMany({
              data: dataArr,
            });
          }   
        }
        

        // const dataArr = [
        //   {
        //     doctorId: '8937fdb8-f5d3-4c55-882d-72cccfc01b1c',
        //     specialtiesId: '2d0e28f0-4d3f-4f70-a102-ed43a80612f5'
        //   },
        //   {
        //     doctorId: '8937fdb8-f5d3-4c55-882d-72cccfc01b1c',
        //     specialtiesId: '8ba8dd81-5661-4073-8342-deeefa2d2533'
        //   }
        // ]


      }




  }); //transaction ended

  const result = await prisma.doctor.findUnique({
    where: {
      id:doctorExist.id,
    },
    include: {
      doctorSpecialties:{
        include: {
          specialties: true
        }
      }
    }
  });

  return result;
}

const filterDoctorBySpecialtiesService = async (specialtiesId: string) => {
  const data = await prisma.doctorSpecialties.findMany({
    where: {
      specialtiesId
    },
    include:{
      doctors:true
    }
  })

  
   const result = data?.map((item)=>item.doctors)
  

 return result;
}

export {
   getAllDoctorsService,
   getSingleDoctorService,
   deleteDoctorService,
   softDeleteDoctorService,
   updateDoctorService,
   filterDoctorBySpecialtiesService
};
