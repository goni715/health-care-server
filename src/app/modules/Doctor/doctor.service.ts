


const getAllDoctorsService = async (query: TAdminQuery) => {
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
            equals: (filterData as any)[key],
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
        totalPages : Math.ceil(total / pagination.limit),
        total,
      },
      data: result,
    };
  };
  


  export {
    getAllDoctorsService
  }