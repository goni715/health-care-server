import { Prisma, PrismaClient } from "@prisma/client"
import { AdminSearchableFields } from "./admin.constant";
import calculatePagination from "../../utils/calculatePagination";

const prisma = new PrismaClient();

const getAllAdminsService = async (query:any) => {
    const { searchTerm, page, limit, sortBy, sortOrder, ...filterData } = query;
    const andConditions: Prisma.AdminWhereInput[] = [];
    //let conditions = {};
    const searchQuery = AdminSearchableFields.map((item)=>({
        [item]: {
            contains: query?.searchTerm,
            mode: 'insensitive'
        }
    }))



    const pagination = calculatePagination({page, limit, sortBy, sortOrder});



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
        

    if(query?.searchTerm){
        andConditions.push({
            OR: searchQuery
        })

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
    if(Object.keys(filterData).length > 0){
        andConditions.push({
            AND: Object.keys(filterData).map(key=>({
                [key]: {
                  equals: filterData[key]
                }
            }))
        })
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
    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions }


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
            [pagination.sortBy]: pagination.sortOrder
        }
    });
    return result;
}


export {
    getAllAdminsService
}