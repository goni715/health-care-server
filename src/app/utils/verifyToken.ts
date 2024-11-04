import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const verifyToken = (token: string, secretKey: Secret) => {
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        return decoded;  
}


export default verifyToken;