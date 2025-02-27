import axios from 'axios';
import configs from '../config/index.js';

export default axios.create({
  baseURL: configs.greenhouseApi.baseUrl,
  headers: {
    ['api-key']: configs.greenhouseApi.apiKey,
  },
});
