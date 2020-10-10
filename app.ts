import express from 'express';
import * as bodyParser from 'body-parser';
import AppController from './src/controllers/app.controller';
import { CronJob } from 'cron';
import mongoose from 'mongoose';
import NewsApiRetriever from './src/entity/news/retriever';
import { DB, SERVER } from './config';

export default class App {
    public app: express.Application;
    public mongoUrl: string = `mongodb://${DB.USER}:${DB.PASSWORD}@${DB.HOST}:${DB.PORT}/${DB.NAME}?authSource=admin`;

    constructor(controllers: AppController[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.set('view engine', 'ejs');
        this.app.set('/views', __dirname);
    }

    private initializeControllers(controllers: AppController[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    public setupCronJob(retriever: NewsApiRetriever) {
        const job = new CronJob('00 14 * * *', () => {
            retriever.requestNews();
            console.log('Job is finished.');
        });
        job.start();
        console.log('Started cron job');
    }

    public async setupDBConnection(): Promise<void> {
        await mongoose.connect(this.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
        });
        console.log('Connected to db');
    }

    public listen() {
        this.app.listen(SERVER.PORT, () => {
            console.log(`App listening on address: ${SERVER.HOST}:${SERVER.PORT}`);
        });
    }
}