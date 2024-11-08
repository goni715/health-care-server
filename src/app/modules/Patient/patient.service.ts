import { Patient } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { calculatePaginationSorting, makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import prisma from "../../shared/prisma";
import { PatientSearchableFields } from "./patient.constant";
import { TPatientQuery } from "./patient.interface";

const getAllPatientsService = async (query: TPatientQuery) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...filters } = query;

  // Search if searchTerm is exist
  let searchQuery;
  if (query?.searchTerm) {
    searchQuery = makeSearchQuery(PatientSearchableFields, query.searchTerm);
  }

  // Apply additional filters- filter-condition for specific field
  let filterQuery;
  if (Object.keys(filters).length > 0) {
    filterQuery = makeFilterQuery(filters);
  }

  // Build the 'where' clause based on search and filter
  const whereConditions: any = {
    isDeleted: false,
    AND: filterQuery,
    OR: searchQuery,
  };

  // Calculate pagination values & sorting
  const pagination = calculatePaginationSorting({ page, limit, sortBy, sortOrder });

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: {
      [pagination.sortBy]: pagination.sortOrder,
    },
    include: {
      patientHealthData: true,
      medicalReport: true
    }
  });

  // Count total patients matching the criteria
  const total = await prisma.patient.count({
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



const getSinglePatientService = async (id: string) => {
  const result = await prisma.patient.findUnique({
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



const deletePatientService = async (id: string): Promise<Patient> => {

  const patient = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  //if id is not exist
  if(!patient){
    throw new ApiError(404, "id does not exist");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    //query-01 patient delete
    const patientDeletedData = await transactionClient.patient.delete({
      where: {
        id,
      },
    });

    //query-02 delete-user
    await transactionClient.user.delete({
      where: {
        email: patientDeletedData.email,
      },
    });

    return patientDeletedData;
  });

  return result;
};




const softDeletePatientService = async (id: string): Promise<Patient> => {
  //if id is not exist
  const patient = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  //if id is not exist
  if(!patient){
    throw new ApiError(404, "id does not exist");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    //query-01-patient-delete
    const patientDeletedData = await transactionClient.patient.update({
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
        email: patientDeletedData.email,
      },
      data: {
        isDeleted: true,
      },
    });

    return patientDeletedData;
  });

  return result;
};


export {
   getAllPatientsService,
   getSinglePatientService,
   deletePatientService,
   softDeletePatientService
};
