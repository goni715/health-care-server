import jwt from 'jsonwebtoken';

const verifyToken = async (token: string, secretKey: string) => {
    try{
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    }
    catch(err){
        throw new Error('You are not unathorized')
    }
}


export default verifyToken;