import { PrismaClient, UserRole } from "@prisma/client";
import hashedPassword from "../utils/hashedPassword";
import config from "../config";

const prisma = new PrismaClient();

const seedSuperAdmin = async () => {
    try {
        const isExistSuperAdmin = await prisma.user.findFirst({
            where: {
                role: UserRole.super_admin
            }
        });

        if (isExistSuperAdmin) {
            console.log("Super admin already exists!")
            return;
        };

        const hashedPass = await hashedPassword(config.super_admin_password as string)

        const superAdminData = await prisma.user.create({
            data: {
                email: config.super_admin_email as string,
                password: hashedPass,
                role: "super_admin",
                admin: {
                    create: {
                        name: "Super Admin",
                        //email: "super@admin.com", //not required
                        contactNumber: "01793837035"
                    }
                }
            }
        });

        console.log("Super Admin Created Successfully!", superAdminData);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await prisma.$disconnect();
    }
};

seedSuperAdmin();