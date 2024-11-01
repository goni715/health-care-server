import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const getAllAdminsService = async (query:any) => {

    const andConditions: Prisma.AdminWhereInput[] = [];
    //let conditions = {};

    if(query?.searchTerm){
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: query?.searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    email: {
                        contains: query?.searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    contactNumber: {
                        contains: query?.searchTerm,
                        mode: 'insensitive'
                    }
                }
            ]
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


    // whereConditions
    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions }


    const result = await prisma.admin.findMany({
        where: whereConditions
    });
    return result;
}


export {
    getAllAdminsService
}