import greenhouseApiClient from '../client/greenhouse-api.client.js';

export async function getGreenhouses(location) {
  const requestConfig = {
    method: 'GET',
    url: 'greenhouse',
    params: { location },
  };

  return greenhouseApiClient.request(requestConfig).then(res => res.data);
}

export async function saveNewGreenhouse(name, location, width, length) {
  const requestConfig = {
    method: 'POST',
    url: 'greenhouse',
    data: { name, location, width, length },
  };

  return greenhouseApiClient.request(requestConfig).then(res => res.data);
}
