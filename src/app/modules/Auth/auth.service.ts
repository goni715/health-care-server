import { TLoginUser } from "./auth.interface"


const loginUserService = async(payload:TLoginUser) => {
    return 'Login service'
}

export {
    loginUserService
}