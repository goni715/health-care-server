import jwt from 'jsonwebtoken';


type TPayload = {
    id: string;
    email: string;
    role: string;
}

const createToken = (payload:TPayload, secretKey:string, expiresIn:string) => {
    const token = jwt.sign(payload, secretKey, {
       algorithm: "HS256",
       expiresIn
     });
 
     return token;
 }
 

 export default createToken;