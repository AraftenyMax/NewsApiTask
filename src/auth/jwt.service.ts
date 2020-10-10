import JWTRedis from "jwt-redis";
import { JWT, REDIS } from "../../config";
import {v1 as uuidv1} from 'uuid';
import { redisClient } from "../db/redis";

export class JwtService {
    jwt: JWTRedis;
    constructor(jwt: JWTRedis) {
        this.jwt = jwt;
    }

    sign<T>(payload: T): Promise<string> {
        return this.jwt.sign(payload, JWT.SECRET, {expiresIn: JWT.ACCESS_TOKEN_EXPIRATION_TIME});
    }

    signRefreshToken<T>(payload: T): Promise<string> {
        return this.jwt.sign(payload, JWT.SECRET, {expiresIn: JWT.REFRESH_TOKEN_EXPIRATION_TIME});
    }

    destroy(token: string): Promise<boolean> {
        return this.jwt.destroy(token);
    }

    verify(token: string): Promise<object> {
        return this.jwt.verify(token, JWT.SECRET);
    }

    async decode<T>(token: string): Promise<T> {
        const decodedToken: T = await this.jwt.decode(token);
        return decodedToken;
    }

    public async generateRefreshToken(): Promise<string> {
        const uuid: string = uuidv1();
        const refreshToken: string = await this.sign<object>({uuid: uuid});
        return refreshToken;
    }
}

export function jwtServiceFactory() {
    let jwtr = new JWTRedis(redisClient);
    const jwtService = new JwtService(jwtr);
    return jwtService;
}
