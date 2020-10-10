import dotenv from 'dotenv';
dotenv.config();

export const DB = {
    NAME: process.env.DB_NAME!,
    USER: process.env.DB_USER!,
    PASSWORD: process.env.DB_PASSWORD!,
    HOST: process.env.DB_HOST!,
    PORT: process.env.DB_PORT!
};

export const SERVER = {
    PORT: process.env.SERVER_PORT!,
    HOST: process.env.SERVER_HOST!,
}

export const GOOGLE = {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    PROJECT_ID: process.env.GOOGLE_PROJECT_ID!,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    REDIRECT_URI: `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/auth/google_callback`,
};

export const NEWSAPI = {
    URL: process.env.NEWS_API_URL!,
    KEY: process.env.NEWS_API_KEY!
};

export const JWT = {
    SECRET: process.env.JWT_SECRET!,
    ACCESS_TOKEN_EXPIRATION_TIME: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME!,
    REFRESH_TOKEN_EXPIRATION_TIME: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME!,
}

export const REDIS = {
    HOST: process.env.REDIS_HOST!,
    PORT: process.env.REDIS_PORT!
}