import { IUser, IUserDoc, User } from "./schema";

export default class UserService {
    async create(user: IUser): Promise<IUserDoc> {
        const data = await User.create(user);
        return data;
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