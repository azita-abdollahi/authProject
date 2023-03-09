import { createClient } from 'redis';
import conf from 'config';
import { config } from 'dotenv';
config()

const redisUrl = `redis://:${process.env.redis_pass || conf.get("redis_pass")}@redis:6379`;
const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected...');
  } catch (err: any) {
    console.log(err.message);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

redisClient.on('error', (err) => console.log(err));

export default redisClient;