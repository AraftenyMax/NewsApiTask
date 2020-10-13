import UserServiceInterface from "../../entity/user/service.interface";
import { IUser, IUserDoc } from '../../entity/user/schema';

function create(user: IUser): Promise<IUserDoc> {
    return Promise.resolve({} as IUserDoc); 
}

function update(user: IUser): Promise<IUserDoc> {
    return Promise.resolve({} as IUserDoc);
}

function findByEmail(email: string): Promise<IUserDoc | null> {
    return Promise.resolve({} as IUserDoc);
}

function findById(id: string): Promise<IUserDoc | null> {
    return Promise.resolve({} as IUserDoc);
}

export const UserServiceMock: UserServiceInterface = {
    create: create,
    update: update,
    findByEmail: findByEmail,
    findById: findById,
}