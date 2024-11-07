import prisma from "../../shared/prisma";
import calculatePaginationSorting from "../../utils/calculatePaginationSorting";
import { DoctorSearchableFields } from "./doctor.constant";
import { TDoctorQuery } from "./doctor.interface";

const getAllDoctorsService = async (query: TDoctorQuery) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...filters } = query;

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
  let filterQuery;
  if (Object.keys(filters).length > 0) {
    filterQuery = Object.keys(filters).map((key) => ({
      [key]: {
        equals: (filters as any)[key],
      },
    }));
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

export { getAllDoctorsService };
