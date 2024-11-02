import { Admin, Prisma, PrismaClient } from "@prisma/client";
import { AdminSearchableFields } from "./admin.constant";
import calculatePagination from "../../utils/calculatePagination";

const prisma = new PrismaClient();

const getAllAdminsService = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...filterData } = query;
  const andConditions: Prisma.AdminWhereInput[] = [{ isDeleted: false }];
  //let conditions = {};
  const searchQuery = AdminSearchableFields.map((item) => ({
    [item]: {
      contains: query?.searchTerm,
      mode: "insensitive",
    },
  }));

  const pagination = calculatePagination({ page, limit, sortBy, sortOrder });

  // [
  //     {
  //         name: {
  //             contains: query?.searchTerm,
  //             mode: 'insensitive'
  //         }
  //     },
  //     {
  //         email: {
  //             contains: query?.searchTerm,
  //             mode: 'insensitive'
  //         }
  //     },
  //     {
  //         contactNumber: {
  //             contains: query?.searchTerm,
  //             mode: 'insensitive'
  //         }
  //     }
  // ]

  if (query?.searchTerm) {
    andConditions.push({
      OR: searchQuery,
    });

    // conditions = {
    //     OR: [
    //         {
    //             name: {
    //                 contains: query?.searchTerm,
    //                 mode: 'insensitive'
    //             }
    //         },
    //         {
    //             email: {
    //                 contains: query?.searchTerm,
    //                 mode: 'insensitive'
    //             }
    //         },
    //         {
    //             contactNumber: {
    //                 contains: query?.searchTerm,
    //                 mode: 'insensitive'
    //             }
    //         }
    //     ]
    // }
  }

  //filter-condition for specific field
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  // {
  //     "AND": [
  //         {
  //             "email": "evan@gmail.com"
  //         },
  //         {
  //             "name": "Osman Goni"
  //         },
  //         {
  //             "cotactNumber": "01793837035"
  //         }
  //     ]
  // }

  // whereConditions
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  // const result = await prisma.admin.findMany({
  //     where: whereConditions,
  //     skip: Number(page-1) * limit || 0,
  //     take: Number(limit) || 10,
  //     orderBy: sortBy && sortOrder ? {
  //         [sortBy]: sortOrder
  //     } : {
  //         createdAt: 'desc'
  //     }
  // });

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: {
      [pagination.sortBy]: pagination.sortOrder,
    },
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });

  return {
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total,
    },
    data: result,
  };
};

const getSingleAdminService = async (id: string) : Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false
    },
  });

  return result;
};

const updateAdminService = async (id: string, payload: Partial<Admin>) : Promise<Admin> => {
  //if id is not exist
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted:false
    }
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteAdminService = async (id: string) : Promise<Admin> => {
  //if id is not exist
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    //query-01 admin delete
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    //query-02 delete-user
    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });

  return result;
};

const softDeleteAdminService = async (id: string): Promise<Admin> => {
  //if id is not exist
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    //query-01-admin-delete
    const adminDeletedData = await transactionClient.admin.update({
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
        email: adminDeletedData.email,
      },
      data: {
        isDeleted: true,
      },
    });

    return adminDeletedData;
  });

  return result;
};

export {
  getAllAdminsService,
  getSingleAdminService,
  updateAdminService,
  deleteAdminService,
  softDeleteAdminService,
};
