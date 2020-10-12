import JWTRedis from "jwt-redis";
import { JWT } from "../../../config";
import { redisClient } from "../../db/redis";
import JwtServiceInterface from "./jwt.service.interface";

export class JwtService implements JwtServiceInterface {
    private jwt: JWTRedis;
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

    decode<T>(token: string): Promise<T> {
        return this.jwt.decode(token);
    }
}

export function jwtServiceFactory(): JwtServiceInterface {
    let jwtr = new JWTRedis(redisClient);
    const jwtService: JwtServiceInterface = new JwtService(jwtr);
    return jwtService;
}
