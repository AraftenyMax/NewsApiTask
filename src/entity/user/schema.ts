import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    favoriteNews?: string[];
}

export interface IUserDoc extends IUser, Document { }

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    favoriteNews: {
        type: [Schema.Types.ObjectId],
        required: false
    }
});

export const User: Model<IUserDoc> = mongoose.model<IUserDoc>('User', UserSchema);