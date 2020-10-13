import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jwt-redis';
import JwtServiceInterface from '../../auth/jwt/jwt.service.interface';
import { createJwtMiddleware } from '../check.jwt.factory';
import { JwtServiceMock } from './jwt.service.mock';

describe('Jwt check middleware', () => {
    let service: JwtServiceInterface;
    let jwtServiceFactory: () => JwtServiceInterface;
    let middleware: (request: Request, response: Response, next: NextFunction) => Promise<void>;

    beforeEach(() => {
        service = { ...JwtServiceMock }
        jwtServiceFactory = () => service;
        middleware = createJwtMiddleware(jwtServiceFactory);
    });

    afterEach(() => jest.clearAllMocks());

    it('Jwt exists', () => {
        expect(jwtServiceFactory()).toBeDefined();
    });

    it('Jwt verifies token', async () => {
        const request: Request = {
            headers: {
                'authorization': 'Bearer valid token',
            }
        } as Request;
        const response: Response = {} as Response;
        const next: NextFunction = jest.fn();

        jwtServiceFactory = () => {
            service.verify = jest.fn().mockImplementationOnce(() => true);
            return service;
        };

        middleware = createJwtMiddleware(jwtServiceFactory);
        await middleware(request, response, next);
        expect(next).toHaveBeenCalled();
    });

    describe('Token verifing handling', () => {
        let request: Request;
        let response: Response;
        let next: NextFunction;

        beforeEach(() => {
            request = {
                headers: {
                    'authorization': 'Bearer invalid token',
                }
            } as Request;
            response = ({
                status: jest.fn().mockImplementation(() => response),
                send: jest.fn()
            } as unknown) as Response;
            next = jest.fn();
        });

        afterEach(() => jest.clearAllMocks());

        it('Handles malformed token', async () => {
            const errorMessage = 'jwt malformed';
            const expectedError = new JsonWebTokenError(errorMessage);
            const errorStatusCode = 401;
            const messageBody = { 'message': 'Error occurred while verifing token' };

            jwtServiceFactory = () => {
                service.verify = jest.fn().mockImplementationOnce(() => {
                    throw expectedError;
                });
                return service;
            }

            middleware = createJwtMiddleware(jwtServiceFactory);
            await middleware(request, response, next);
            expect(response.status).toHaveBeenCalledWith(errorStatusCode);
            expect(response.send).toHaveBeenCalledWith(messageBody);
            expect(next).not.toHaveBeenCalled();
        });

        it('Handles expired token', async () => {
            const errorMessage = 'jwt expired';
            const expiredDate = new Date(Date.now());
            const expectedError = new TokenExpiredError(errorMessage, expiredDate);
            const errorStatusCode = 401;
            const messageBody = { 'message': 'Access token has expired' };

            jwtServiceFactory = () => {
                service.verify = jest.fn().mockImplementationOnce(() => {
                    throw expectedError;
                });
                return service;
            }

            middleware = createJwtMiddleware(jwtServiceFactory);
            await middleware(request, response, next);
            expect(response.status).toHaveBeenCalledWith(errorStatusCode);
            expect(response.send).toHaveBeenCalledWith(messageBody);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('Token extraction errors', () => {
        let request: Request;
        let response: Response;
        let next: NextFunction;
        let expectedBody: object;
        let expectedErrorStatus: number;

        beforeEach(() => {
            response = ({
                status: jest.fn().mockImplementationOnce(() => response),
                send: jest.fn()
            } as unknown) as Response;
            next = jest.fn();
            expectedBody = { 'message': 'Invalid access token has been provided' };
        });

        afterEach(() => jest.clearAllMocks());
        it('Handles token header abscence', async () => {
            request = {} as Request;
            expectedErrorStatus = 401;
            middleware = createJwtMiddleware(jwtServiceFactory);
            await middleware(request, response, next);
            expect(response.status).toHaveBeenCalledWith(expectedErrorStatus);
            expect(response.send).toHaveBeenCalledWith(expectedBody);
            expect(next).not.toHaveBeenCalled();
        });
    });
});