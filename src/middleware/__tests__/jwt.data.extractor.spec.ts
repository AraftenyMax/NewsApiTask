import { NextFunction, request, Request, Response } from "express";
import { JsonWebTokenError } from "jwt-redis";
import JwtServiceInterface from "../../auth/jwt/jwt.service.interface";
import { createJwtDataExtractor } from "../jwt.data.extractor.factory";
import { JwtServiceMock } from "./jwt.service.mock";

describe('Jwt data extractor spec', () => {
    let service: JwtServiceInterface;
    let jwtServiceFactory: () => JwtServiceInterface;
    let middleware: (request: Request, response: Response, next: NextFunction) => Promise<void>;
    let request: Request;
    let response: Response;
    let next: NextFunction;

    beforeEach(() => {
        service = { ...JwtServiceMock }
        jwtServiceFactory = () => service;
        middleware = createJwtDataExtractor(jwtServiceFactory);
        response = ({
            status: jest.fn().mockImplementation(() => response),
            send: jest.fn()
        } as unknown) as Response;
        next = jest.fn();
    });

    afterEach(() => jest.clearAllMocks());

    it('Jwt exists', () => {
        expect(jwtServiceFactory()).toBeDefined();
    });

    it('Decodes valid token', async () => {
        const expectedPayload = {id: 'udbsfhdfs', email: "Some email"};
        request = {
            headers: {
                authorization: 'Bearer token'
            },
            user: {}
        } as Request;
        response = {} as Response;
        next = jest.fn();

        service.decode = jest.fn().mockImplementationOnce(() => {
            return expectedPayload;
        });
        middleware = createJwtDataExtractor(jwtServiceFactory);
        await middleware(request, response, next);
        expect(request.user?.id).toBe(expectedPayload.id);
        expect(request.user?.id).toBe(expectedPayload.id);
        expect(next).toHaveBeenCalled();
    });

    it('Sends error if token is invalid', async () => {
        const expectedStatusCode = 401;
        const expectedBody = {'message': 'Error occurred while extracting data from jwt'};
        request = {
            headers: {
                authorization: 'token'
            }
        } as Request;
        next = jest.fn();

        service.decode = jest.fn().mockImplementationOnce(() => {
            throw new JsonWebTokenError('Something bad occurred');
        });
        middleware = createJwtDataExtractor(jwtServiceFactory);
        await middleware(request, response, next);
        expect(response.send).toHaveBeenCalledWith(expectedBody);
        expect(response.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(next).not.toHaveBeenCalled();
    });
});