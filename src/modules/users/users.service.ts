import { getUserFromId } from "./users.repository";
import { GetUser, UserInput } from "./users.validators";

const getUser = async (param: GetUser) => {
    return getUserFromId(param.userId);
}

const createUser = async (param: UserInput) => {
    //TODO: check if user is coming through google
}

export {
    getUser,
    createUser,
}