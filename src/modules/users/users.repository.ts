import { prisma } from "../../db/prisma";

const getUserFromId = async (userId: string) => {
    return await prisma.user.findUnique({
        where: {
            id: userId,
        }
    });
}

export {
    getUserFromId,
}