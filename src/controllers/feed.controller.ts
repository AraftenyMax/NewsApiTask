import express from 'express';
import { Router, Request, Response } from 'express';
import { INews, INewsDoc } from '../entity/news/schema';
import NewsService from '../entity/news/service';
import UserService from '../entity/user/service';
import AppController from "./app.controller";
import { checkJwt } from '../middleware/check.jwt.factory';
import { IUserDoc } from '../entity/user/schema';
import AuthController from './auth.controller';
import { JwtEncryptedPayload } from '../auth/auth.payload';

export default class FeedController implements AppController {
    path: string = '/feed';
    router: Router;
    userService: UserService;
    newsService: NewsService;

    constructor(router: Router, userService: UserService, newsService: NewsService) {
        this.router = router;
        this.userService = userService;
        this.newsService = newsService;
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(this.path, [checkJwt], this.createNews);
        this.router.delete(`${this.path}/:id`, [checkJwt], this.deleteNews);
        this.router.get(this.path, this.getAllNews);
    }

    createNews = async (request: Request, response: Response) => {
        const decodedToken: JwtEncryptedPayload = AuthController.getPayload<JwtEncryptedPayload>(request)!;
        const id: string = decodedToken.id;
        const dbUser: IUserDoc | null = await this.userService.findById(id);
        if (dbUser) {
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
            return;
        }
        response.status(403).send({ 'message': 'Invalid user id' });
    }

    deleteNews = async (request: Request, response: Response) => {
        const decodedToken: JwtEncryptedPayload = AuthController.getPayload<JwtEncryptedPayload>(request)!;
        const id: string = decodedToken.id;
        const dbUser: IUserDoc | null = await this.userService.findById(id);
        if (dbUser) {
            const newsId: string = <string>request.params.id;
            const deletePayload = {newsId, userId: id}
            await this.newsService.deleteNewsForUser(deletePayload);
            response.status(200).send({'message': 'Ok'});
            return;
        }
        response.status(403).send({ 'message': 'Invalid user id' });
    }

    getAllNews = async(request: Request, response: Response) => {
        const allNews: INewsDoc[] = await this.newsService.getAllNews();
        response.status(200).send(allNews);
    }
}