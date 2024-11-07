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
  });

  // Count total doctors matching the criteria
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

export { getAllPatientsService };
