import express from 'express';
import { Router } from "express";
import { loginLink } from '../auth/oauth2.service';
import AppController from "./app.controller";

export default class IndexController implements AppController {
    path: string = '';
    router: Router;
    constructor(router: Router) {
        this.router = Router();
        this.intializeRoutes();
    }

    indexPage = (request: Express.Request, response: express.Response) => {
        return response.render('index', {loginLink: loginLink});
    }
     
    public intializeRoutes() {
        this.router.get(this.path, this.indexPage);
    }
}