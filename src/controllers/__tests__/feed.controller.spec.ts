import { mocked } from 'ts-jest/utils';
import { Router } from 'express';
import FeedController from '../feed.controller';
import { INews } from '../../entity/news/schema';
import { UserServiceMock } from './user.service.mock';
import { NewsServiceMock } from './news.service.mock'; 

jest.mock('express', () => {
    Router: jest.fn().mockImplementation(() => {
        return {
            get: () => { },
            post: () => { },
            delete: () => { }
        }
    });
});

describe('FeedController', () => {
    const MockedRouter = mocked(Router, true);
    let controller: FeedController;
    it('Controller exists', () => {
        controller = new FeedController(UserServiceMock, NewsServiceMock);
    })
})