import { IUser, IUserDoc, User } from "./schema";
import UserServiceInterface from "./service.interface";

export default class UserService implements UserServiceInterface {
    create(user: IUser): Promise<IUserDoc> {
        return User.create(user);
    }

    update(user: IUserDoc): Promise<IUserDoc> {
        return user.save();
    }

    findByEmail(email: string): Promise<IUserDoc | null> {
        return User.findOne({email: email}).exec();
    }

    findById(id: string): Promise<IUserDoc | null> {
        return User.findOne({_id: id}).exec();
    }
}