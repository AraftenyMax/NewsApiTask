import App from './app';
import AuthController from './src/controllers/auth.controller';
import FeedController from './src/controllers/feed.controller';
import FavoritesController from './src/controllers/favorites.controller';
import dotenv from 'dotenv';
import IndexController from './src/controllers/index.controller';
import NewsApiRetriever from './src/entity/news/retriever';
import UserService from './src/entity/user/service';
import NewsService from './src/entity/news/service';
import { Router } from 'express';
import { jwtServiceFactory } from './src/auth/jwt/jwt.service';
import OAuth2Service from './src/auth/oauth2.service';
import JwtServiceInterface from './src/auth/jwt/jwt.service.interface';

dotenv.config();

const userService: UserService = new UserService();
const newsService: NewsService = new NewsService();
const newsApiRetriever: NewsApiRetriever = new NewsApiRetriever();
const jwtService: JwtServiceInterface = jwtServiceFactory();
const oauth2Service: OAuth2Service = new OAuth2Service();

const app = new App([
    new AuthController(Router(), userService, jwtService, oauth2Service),
    new FeedController(userService, newsService),
    new FavoritesController(Router(), userService, newsService),
    new IndexController(Router()),
]);

async function main() {
    await app.setupDBConnection();
    app.listen();
    app.setupCronJob(newsApiRetriever);
}

main();