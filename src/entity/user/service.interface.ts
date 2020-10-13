import { IUser, IUserDoc } from "./schema";

export default interface UserServiceInterface {
    create(user: IUser): Promise<IUserDoc>;
    update(user: IUser): Promise<IUserDoc>;
    findByEmail(email: string): Promise<IUserDoc | null>;
    findById(token: string): Promise<IUserDoc | null>;
}