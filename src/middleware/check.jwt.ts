import { jwtServiceFactory } from '../auth/jwt/jwt.service';
import { createJwtMiddleware } from './check.jwt.factory';

export const checkJwt = createJwtMiddleware(jwtServiceFactory);