"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = exports.forgotPasswordService = exports.changePasswordService = exports.refreshTokenService = exports.loginUserService = void 0;
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createToken_1 = __importDefault(require("../../utils/createToken"));
const verifyToken_1 = __importDefault(require("../../utils/verifyToken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_utlis_1 = require("./auth.utlis");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const hashedPassword_1 = __importDefault(require("../../utils/hashedPassword"));
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!userData) {
        throw new Error("Could not find this email!");
    }
    //check if the user is deleted
    if (userData.isDeleted) {
        throw new Error('Your account is deleted');
    }
    //check if the user is blocked
    const blockStatus = userData.status;
    if (blockStatus === "blocked") {
        throw new Error('Your account is blocked');
    }
    //check password
    const isPasswordMatch = yield bcryptjs_1.default.compare(payload.password, userData.password); //return true or false
    if (!isPasswordMatch) {
        throw new Error("Wrong Password!");
    }
    //token-payload
    const jwtPayload = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
    };
    const accessToken = (0, createToken_1.default)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, createToken_1.default)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange,
    };
});
exports.loginUserService = loginUserService;
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = (0, verifyToken_1.default)(token, config_1.default.jwt_refresh_secret);
    }
    catch (err) {
        throw new Error("Invalid refreshToken");
    }
    const userExist = yield prisma_1.default.user.findUnique({
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
    };
    const accessToken = (0, createToken_1.default)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken
    };
});
exports.refreshTokenService = refreshTokenService;
const changePasswordService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    //checking if the password is not correct
    const isPasswordMatched = yield (0, auth_utlis_1.checkPassword)(oldPassword, user === null || user === void 0 ? void 0 : user.password); //return true or false
    if (!isPasswordMatched) {
        throw new ApiError_1.default(403, 'Wrong Old Password');
    }
    //update-password
    const result = yield prisma_1.default.user.update({
        where: {
            id
        },
        data: {
            password: yield (0, hashedPassword_1.default)(newPassword),
            needPasswordChange: false
        }
    });
    return true;
});
exports.changePasswordService = changePasswordService;
const forgotPasswordService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield prisma_1.default.user.findUnique({
        where: {
            email
        }
    });
    //check if the user is not exist
    if (!userExist) {
        throw new ApiError_1.default(404, "Could not Find this Email!");
    }
    //check if the user is deleted
    if (userExist.isDeleted) {
        throw new ApiError_1.default(403, "Your acount is deleted");
    }
    //check if the user is blocked
    const blockStatus = userExist.status;
    if (blockStatus === "blocked") {
        throw new ApiError_1.default(403, "Your account is blocked");
    }
    //token-payload
    const jwtPayload = {
        id: userExist.id,
        email: userExist.email,
        role: userExist.role,
    };
    const resetToken = (0, createToken_1.default)(jwtPayload, config_1.default.reset_secret, config_1.default.reset_expires_in);
    const restPassLink = config_1.default.reset_pass_ui_link + `?email=${userExist.email}&token=${resetToken}`;
    //send-email
    yield (0, sendEmail_1.default)(userExist === null || userExist === void 0 ? void 0 : userExist.email, restPassLink);
    return null;
});
exports.forgotPasswordService = forgotPasswordService;
const resetPasswordService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword, token } = payload;
    try {
        //verify-token
        (0, verifyToken_1.default)(token, config_1.default.reset_secret);
    }
    catch (err) {
        throw new ApiError_1.default(403, "Invalid Token or Expired token");
    }
    const userExist = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    //check if the user is not exist
    if (!userExist) {
        throw new ApiError_1.default(404, "Could not Find this Email!");
    }
    //check if the user is deleted
    if (userExist.isDeleted) {
        throw new ApiError_1.default(403, "Your acount is deleted");
    }
    //check if the user is blocked
    const blockStatus = userExist.status;
    if (blockStatus === "blocked") {
        throw new ApiError_1.default(403, "Your account is blocked");
    }
    //update-password
    yield prisma_1.default.user.update({
        where: {
            email: userExist.email,
        },
        data: {
            password: yield (0, hashedPassword_1.default)(newPassword),
            needPasswordChange: false,
        },
    });
});
exports.resetPasswordService = resetPasswordService;
