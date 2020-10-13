import { Router, Request, Response } from 'express';
import { INews, INewsDoc } from '../entity/news/schema';
import NewsService from '../entity/news/service';
import UserService from '../entity/user/service';
import AppController from "./app.controller";
import { checkJwt } from '../middleware/check.jwt';
import { IUserDoc } from '../entity/user/schema';
import { extractJwtData } from '../middleware/jwt.data.extractor';

export default class FeedController implements AppController {
    path: string = '/feed';
    router: Router = Router();
    userService: UserService;
    newsService: NewsService;

    constructor(userService: UserService, newsService: NewsService) {
        this.userService = userService;
        this.newsService = newsService;
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(this.path, [checkJwt, extractJwtData], this.createNews);
        this.router.delete(`${this.path}/:id`, [checkJwt, extractJwtData], this.deleteNews);
        this.router.get(this.path, this.getAllNews);
    }

    createNews = async (request: Request, response: Response) => {
        const dbUser: IUserDoc | null = await this.userService.findById((request.user as any).id);
        if (!dbUser) {
            response.status(403).send({ 'message': 'Invalid user id' });
            return;
        }
        const { source, author, title, description, url, urlToImage, publishedAt, content } = request.body;
        const news: INews = {
            source: source,
            author: author,
            title: title,
            description: description,
            url: url,
            urlToImage: urlToImage,
            publishedAt: publishedAt,
            content: content,
            createdBy: dbUser._id
        };
        const savedItem = await this.newsService.create(news);
        response.status(201).send(savedItem);
    }

    deleteNews = async (request: Request, response: Response) => {
        const id: string = (request.user as any).id;
        const dbUser: IUserDoc | null = await this.userService.findById(id);
        if (!dbUser) {
            response.status(403).send({ 'message': 'Invalid user id' });
            return;
        }
        const newsId: string = <string>request.params.id;
        const deletePayload = { newsId, userId: id }
        await this.newsService.deleteNewsForUser(deletePayload);
        response.status(200).send({ 'message': 'Ok' });
    }

    getAllNews = async (request: Request, response: Response) => {
        const allNews: INewsDoc[] = await this.newsService.getAllNews();
        response.status(200).send(allNews);
    }
}