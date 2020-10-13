import { INewsDoc, INews} from "../../entity/news/schema"
import NewsServiceInterface from "../../entity/news/service.interface";

function getAllNews(): Promise<INewsDoc[]> {
    throw new Error('Mock is not implented');
}

function create(news: INews): Promise<INewsDoc> {
    throw new Error('Mock is not implented');
}

function deleteNewsForUser(deletePayload: {newsId: string, userId: string}): Promise<INewsDoc> {
    throw new Error('Mock is not implented');
}   

function deleteNews(id: string): Promise<boolean> {
    throw new Error('Mock is not implented');
}

function findById(id: string): Promise<INewsDoc> {
    throw new Error('Mock is not implented');
}

function getFavoriteNewsForUser(ids: string[]): Promise<INewsDoc[]> {
    throw new Error('Mock is not implented');
}

function saveMany(news: INews[]): Promise<INewsDoc[]> {
    throw new Error('Mock is not implented');
}

export const NewsServiceMock: NewsServiceInterface = {
    getAllNews: getAllNews,
    create: create,
    delete: deleteNews,
    deleteNewsForUser: deleteNewsForUser,
    findById: findById,
    getFavoriteNewsForUser: getFavoriteNewsForUser,
    saveMany: saveMany,
}