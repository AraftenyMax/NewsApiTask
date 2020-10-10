import redis, { RedisClient } from 'redis';
import { REDIS } from '../../config';

let redisClient: RedisClient = redis.createClient({
    host: REDIS.HOST,
    port: Number(REDIS.PORT)
});

export {redisClient};