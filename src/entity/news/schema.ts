import mongoose, { Schema, Model, Document } from 'mongoose';

export interface INews {
    source: string;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: Date;
    content: string;
    createdBy?: string;
}

export interface INewsDoc extends INews, Document {}

const NewsSchema: Schema = new Schema({
    source: {type: String},
    author: {type: String},
    title: {type: String},
    description: {type: String},
    url: {type: String},
    urlToImage: {type: String},
    publishedAt: {type: Date},
    content: {type: String},
    createdBy: {
        type: Schema.Types.ObjectId,
        required: false
    }
});

export const News: Model<INewsDoc> = mongoose.model<INewsDoc>('News', NewsSchema);