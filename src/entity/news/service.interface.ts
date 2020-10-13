import { INewsDoc, INews} from "../../entity/news/schema"

export default interface NewsServiceInterface {
     getAllNews(): Promise<INewsDoc[]>; 
     create(news: INews): Promise<INewsDoc>; 
     deleteNewsForUser(deletePayload: {newsId: string, userId: string}): Promise<INewsDoc | null>;         
     delete(id: string): Promise<boolean>;
     findById(id: string): Promise<INewsDoc | null>;
     getFavoriteNewsForUser(ids: string[]): Promise<INewsDoc[]>; 
     saveMany(news: INews[]): Promise<INewsDoc[]>;
}