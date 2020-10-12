import { jwtServiceFactory } from '../auth/jwt/jwt.service';
import { createJwtMiddleware } from './check.jwt.factory';

const checkJwt = createJwtMiddleware(jwtServiceFactory);

export {checkJwt};