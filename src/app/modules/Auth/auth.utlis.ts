import bcrypt from 'bcryptjs';

export const checkPassword = async (plainTextPass: string, hashPassword: string) => {
    return await bcrypt.compare(plainTextPass, hashPassword);
 }
 