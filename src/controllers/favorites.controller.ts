import { Request, Response } from 'express';
import { Router } from 'express';
import NewsService from '../entity/news/service';
import { IUserDoc } from '../entity/user/schema';
import UserService from '../entity/user/service';
import { checkJwt } from '../middleware/check.jwt';
import { extractJwtData } from '../middleware/jwt.data.extractor';
import AppController from "./app.controller";

export default class FavoritesController implements AppController {
    path: string = '/favorites';
    router: Router;
    newsService: NewsService;
    userService: UserService;

    constructor(router: Router, userService: UserService, newsService: NewsService) {
        this.router = router;
        this.newsService = newsService;
        this.userService = userService;
        this.initializeRoutes();
    }

    getFavorites = async (request: Request, response: Response) => {
        const dbUser: IUserDoc | null = await this.userService.findById((request.user as any).id);
        if (dbUser) {
            const newsIds: string[] = dbUser.favoriteNews ?? [];
            const favorites = await this.newsService.getFavoriteNewsForUser(newsIds);
            response.status(200).send(favorites);
            return;
        }
        response.status(403).send({ 'message': 'Invalid user id' });
    }

    createFavorite = async (request: Request, response: Response) => {
        const dbUser: IUserDoc | null = await this.userService.findById((request.user as any).id);
        if (!dbUser) {
            response.status(404).send({ 'message': 'No user with such id' });
            return;
        }
        const newsId = <string>request.params.id;
        const news = await this.newsService.findById(newsId);
        if (!news) {
            response.status(404).send({ 'message': 'No news with such id' });
            return;
        }
        if (dbUser.favoriteNews?.includes(newsId)) {
            response.status(401).send({ 'message': 'User have already news with this id' });
            return;
        }
        if (!dbUser.favoriteNews) {
            dbUser.favoriteNews = [];
        }
        dbUser.favoriteNews.push(newsId);
        await this.userService.update(dbUser);
        response.status(204).send({'message': 'Ok'});
    }

    removeFromFavorites = async (request: Request, response: Response) => {
        const dbUser: IUserDoc | null = await this.userService.findById((request.user as any).id);
        if (!dbUser) {
            response.status(404).send({ 'message': 'No user with such id' });
            return;
        }
        const newsId = <string>request.params.id;
        const news = await this.newsService.findById(newsId);
        if (!news) {
            response.status(404).send({ 'message': 'No news with such id' });
            return;
        }
        if (!dbUser.favoriteNews?.includes(newsId)) {
            response.status(404).send({ 'message': 'User don\'t have news with this id' });
            return;
        }
        dbUser.favoriteNews = dbUser.favoriteNews.filter(currentNewsId => currentNewsId === newsId);
        await this.userService.update(dbUser);
        response.status(204).send({'message': 'Ok'});
    }

    initializeRoutes() {
        this.router.get(`${this.path}`, [checkJwt, extractJwtData], this.getFavorites);
        this.router.post(`${this.path}/save/:id`, [checkJwt, extractJwtData], this.createFavorite);
        this.router.delete(`${this.path}/:id`, [checkJwt, extractJwtData], this.removeFromFavorites);
    }
}