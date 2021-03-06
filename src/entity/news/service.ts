import { INews, News, INewsDoc } from "./schema";
import NewsServiceInterface from "./service.interface";

export default class NewsService implements NewsServiceInterface {
    getAllNews(): Promise<INewsDoc[]> {
        return News.find().exec();
    }

    create(news: INews): Promise<INewsDoc> {
        return News.create(news);
    }

    deleteNewsForUser(deletePayload: {newsId: string, userId: string}): Promise<INewsDoc | null> {
        const {newsId, userId} = deletePayload;
        return News.findOneAndDelete({createdBy: userId, _id: newsId}).exec();
    }

    delete(id: string): Promise<any> {
        return News.deleteOne({_id: id}).exec();
    }

    findById(id: string): Promise<INewsDoc | null> {
        return News.findById(id).exec();
    }

    getFavoriteNewsForUser(ids: string[]): Promise<INewsDoc[]> {
        return News.find().where('_id').in(ids).exec();
    }

    saveMany(news: INews[]): Promise<INewsDoc[]> {
        return News.insertMany(news);
    }
}