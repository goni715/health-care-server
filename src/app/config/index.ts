import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
}