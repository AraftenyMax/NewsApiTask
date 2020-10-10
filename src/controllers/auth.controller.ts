import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { Router } from "express";
import AppController from "./app.controller";
import UserService from "../entity/user/service";
import { IUser, IUserDoc } from "../entity/user/schema";
import { JwtEncryptedPayload } from "../auth/auth.payload";
import { JwtService } from "../auth/jwt.service";
import { checkJwt } from "../middleware/check.jwt";
import OAuth2Service from "../auth/oauth2.service";
import { OAuth2Profile } from "../auth/oauth2.credentials";

export default class AuthController implements AppController {
    path: string = '/auth';
    router: Router;
    userService: UserService;
    jwtService: JwtService;
    oauth2Service: OAuth2Service;

    constructor(router: Router, userService: UserService,
        jwtService: JwtService, oauth2Service: OAuth2Service) {
        this.router = router;
        this.userService = userService;
        this.jwtService = jwtService;
        this.oauth2Service = oauth2Service;
        this.intializeRoutes();
    }

    logout = async (request: Request, response: Response) => {
        const token: string = AuthController.retrieveToken(request)!;
        const userInfo: JwtEncryptedPayload = AuthController.getPayload<JwtEncryptedPayload>(request)!;
        const dbUser: IUserDoc | null = await this.userService.findById(userInfo.id);
        if (!dbUser) {
            response.status(404).send({ 'message': 'No user with such id' });
            return;
        }
        await this.jwtService.destroy(token);
        response.status(200);
    }

    public static retrieveToken(request: Request): string | undefined {
        return request.headers['authorization']?.split(' ')[1];
    }

    public static extractUserId(request: Request): string {
        const id = this.getPayload<JwtEncryptedPayload>(request)!.id;
        return id;
    }

    public static getPayload<T>(request: Request): T | undefined {
        const token: string = AuthController.retrieveToken(request) ?? '';
        if (!token) {
            return undefined;
        }
        const decodedToken = <T>jwt.decode(token);
        return decodedToken;
    }

    googleAuthCallback = async (request: Request, response: Response) => {
        const code: string = <string>request.query.code;
        const userProfile: OAuth2Profile = await this.oauth2Service.authenticateUser({ code });
        let user: IUserDoc | null = await this.userService.findByEmail(userProfile.email);
        let created = false;
        const expiresIn: Date = new Date(Date.now());
        if (!user) {
            const userCreationInput: IUser = {
                email: userProfile.email,
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
            }
            user = await this.userService.create(userCreationInput);
            created = true;
        }
        const access_token = await this.jwtService.sign({ email: user.email, id: user.id });
        const refreshToken = await this.jwtService.signRefreshToken({ email: user.email, id: user.id });
        response.send({
            'access_token': access_token,
            'refresh_token': refreshToken,
            'created': created
        });
    }

    refreshToken = async (request: Request, response: Response) => {
        try {
            const refreshToken = <string>request.body.refreshToken;
            console.log(refreshToken);
            await this.jwtService.verify(refreshToken);
            const payload: JwtEncryptedPayload = await this.jwtService.decode(refreshToken);
            const userInDb = await this.userService.findById(payload.id);
            if (!userInDb) {
                response.status(404).send({ 'message': 'User with such id doesn\'t exist' });
            }
            const {email, id} = payload;
            const newJwt = await this.jwtService.sign({email, id});
            response.status(200).send({ 'access_token': newJwt });
        } catch (err) {
            console.log(err);
            response.status(401).send({ 'message': 'Refresh token is invalid' });
        }
    }

    public intializeRoutes() {
        this.router.get(`${this.path}/google_callback`, this.googleAuthCallback);
        this.router.get(`${this.path}/logout`, [checkJwt], this.logout);
        this.router.get(`${this.path}/token`, this.refreshToken);
    }
}