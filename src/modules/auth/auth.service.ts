import { authUserEmail } from "./auth.repository"
import { UserAuthInput } from "./auth.types";

export const authenticateUserWithEmail = async (param: UserAuthInput): Promise<boolean> => {
    return await authUserEmail(param.email, param.password);
}