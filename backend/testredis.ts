// testRedis.ts
import redis from "../backend/src/utils/redis";

async function testRedis() {
  const keys = await redis.keys("*");
  console.log("All Redis Keys:", keys);

  for (const key of keys) {
    const val = await redis.get(key);
    console.log(`\nKey: ${key}\nValue: ${val}`);
  }

  process.exit(0);
}

testRedis();
