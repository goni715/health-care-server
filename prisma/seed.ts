import { UserRole } from "@prisma/client";
import prisma from "../src/app/shared/prisma";
import hashedPassword from "../src/app/utils/hashedPassword";
import config from "../src/app/config";

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