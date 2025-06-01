import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function getData(key: string): Promise<string> {
  await redisClient.connect();

  let value = await redisClient.get(key);
  if (value) {
    console.log('Cache hit for key:', key);
  } else {
    console.log('Cache miss for key:', key);
    value = `Value for ${key} - set at ${new Date().toISOString()}`;
    await redisClient.set(key, value, {
      EX: 60, // expire in 60 seconds
    });
  }

  await redisClient.disconnect();

  return value;
}

async function testRedisCache() {
  const key = 'test_key';

  const first = await getData(key);
  console.log('First call result:', first);

  const second = await getData(key);
  console.log('Second call result:', second);
}

testRedisCache().catch(console.error);
