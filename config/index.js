import * as dotenv from 'dotenv';

dotenv.config();

export default {
  bot: {
    port: Number(process.env.BOT_PORT) || 5000,
    token: process.env.BOT_TOKEN || '',
  },
  greenhouseApi: {
    baseUrl: process.env.GREENHOUSE_API_BASE_URL,
    apiKey: process.env.API_KEY,
  },
};
