import config from "../../config";
import prisma from "../../shared/prisma";
import createToken from "../../utils/createToken";
import verifyToken from "../../utils/verifyToken";
import { TChangePassword, TLoginUser, TResetPassword } from "./auth.interface";
import bcrypt from "bcryptjs";
import { checkPassword } from "./auth.utlis";
import ApiError from "../../errors/ApiError";
import hashedPassword from "../../utils/hashedPassword";
import { Secret } from "jsonwebtoken";
import sendEmail from "../../utils/sendEmail";

const loginUserService = async (payload: TLoginUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new Error("Could not find this email!");
  }


  //check if the user is deleted
  if(userData.isDeleted){
    throw new Error('Your account is deleted')
  }


  //check if the user is blocked
  const blockStatus = userData.status;
  if(blockStatus === "blocked"){
    throw new Error('Your account is blocked')
  }


  //check password
  const isPasswordMatch: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  ); //return true or false
  if (!isPasswordMatch) {
    throw new Error("Wrong Password!");
  }

  //token-payload
  const jwtPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};




const refreshTokenService = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, config.jwt_refresh_secret as string);
  } catch (err) {
    throw new Error("Invalid refreshToken");
  }

  const userExist = await prisma.user.findUnique({
    where: {
      email: decodedData.email,
    },
  });

  //check if the user is not exist
  if (!userExist) {
    throw new Error("Could not find this email!");
  }

  //check if the user is deleted
  if (userExist.isDeleted) {
    throw new Error("This account is deleted");
  }

  //check if the user is blocked
  const blockStatus = userExist.status;
  if (blockStatus === "blocked") {
    throw new Error("This account is blocked");
  }

  //create new accessToken
  const jwtPayload = {
    id: userExist.id,
    email: userExist.email,
    role: userExist.role
  }
  const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string)

  return {
    accessToken
  }

};



const changePasswordService = async(id: string, payload: TChangePassword) => {
  const { oldPassword, newPassword } = payload;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  //checking if the password is not correct
  const isPasswordMatched = await checkPassword(
    oldPassword,
    user?.password as string
  ); //return true or false

 if(!isPasswordMatched){
  throw new ApiError(403, 'Wrong Old Password');
 }


 //update-password
 const result = await prisma.user.update({
  where: {
    id
  },
  data: {
    password: await hashedPassword(newPassword),
    needPasswordChange: false
  }
 });


  return true;
}



const forgotPasswordService = async (email: string) => {
  const userExist = await prisma.user.findUnique({
    where: {
      email
    }
  })


    //check if the user is not exist
  if(!userExist){
    throw new ApiError(404, "Could not Find this Email!")
  }

  
  //check if the user is deleted
  if (userExist.isDeleted) {
    throw new ApiError(403, "Your acount is deleted")
  }

  //check if the user is blocked
  const blockStatus = userExist.status;
  if (blockStatus === "blocked") {
    throw new ApiError(403, "Your account is blocked")
  }

  
  //token-payload
  const jwtPayload = {
    id: userExist.id,
    email: userExist.email,
    role: userExist.role,
  };

  const resetToken = createToken(jwtPayload, config.reset_secret as Secret, config.reset_expires_in as string);
  const restPassLink = config.reset_pass_ui_link+`?email=${userExist.email}&token=${resetToken}`

  //send-email
  await sendEmail(userExist?.email, restPassLink);
  return null;
}


const resetPasswordService = async (payload: TResetPassword) => {
  const { email, newPassword, token } = payload;

  try {
    //verify-token
    verifyToken(token, config.reset_secret as Secret);
  } catch (err) {
    throw new ApiError(403, "Invalid Token or Expired token");
  }

  const userExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  //check if the user is not exist
  if (!userExist) {
    throw new ApiError(404, "Could not Find this Email!");
  }

  //check if the user is deleted
  if (userExist.isDeleted) {
    throw new ApiError(403, "Your acount is deleted");
  }

  //check if the user is blocked
  const blockStatus = userExist.status;
  if (blockStatus === "blocked") {
    throw new ApiError(403, "Your account is blocked");
  }

  //update-password
  await prisma.user.update({
    where: {
      email: userExist.email,
    },
    data: {
      password: await hashedPassword(newPassword),
      needPasswordChange: false,
    },
  });
};

export {
   loginUserService,
   refreshTokenService,
   changePasswordService,
   forgotPasswordService,
   resetPasswordService
};
