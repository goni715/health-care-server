import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const getAllAdminsService = async () => {
    const result = await prisma.admin.findMany();
    return result;
}


export {
    getAllAdminsService
}