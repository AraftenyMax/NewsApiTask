import { NextFunction, Request, Response } from "express";
import { JwtEncryptedPayload } from "../auth/auth.payload";
import JwtServiceInterface from "../auth/jwt/jwt.service.interface";

export function createJwtDataExtractor(jwtServiceFactory: () => JwtServiceInterface): 
    (req: Request, res: Response, next: NextFunction) => Promise<void> {
    const jwtService: JwtServiceInterface = jwtServiceFactory();
    return async function extractJwtDataMiddleware(request: Request, response: Response, next: NextFunction) {
        try {
            const token = <string>request.headers['authorization'];
            const payload = await jwtService.decode<JwtEncryptedPayload>(token);
            request.user = {
                id: payload.id,
                email: payload.id
            };
            next();
        } catch (err) {
            console.log(err);
            response.status(401).send({'message': 'Error occurred while extracting data from jwt'});
        }
    }
}