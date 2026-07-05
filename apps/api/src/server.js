import { createApp } from "./app.js";
import { config } from "./config.js";
import { connectRedis } from "./redis.js";

await connectRedis();

createApp().listen(config.PORT, () => {
  console.log(`LinkPulse API listening on ${config.PORT}`);
});
