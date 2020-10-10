import { NextFunction, Request, Response } from "express";
import { JwtService, jwtServiceFactory } from "../auth/jwt.service";

function createJwtMiddleware(factory: () => JwtService) {
    const jwtService = factory();
    return async function checkJwtMiddleware(req: Request, res: Response, next: NextFunction) {
        const tokenHeader = <string>req.headers['authorization'];
        const token = tokenHeader.substr(tokenHeader.indexOf(' ') + 1);
        try {
            await jwtService.verify(token);
            next();
        } catch {
            res.status(401).send({'message': 'Access token is invalid'});
        }
    }
}

const checkJwt = createJwtMiddleware(jwtServiceFactory);

export {checkJwt, createJwtMiddleware};