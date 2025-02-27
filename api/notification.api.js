import greenhouseApiClient from '../client/greenhouse-api.client.js';

export async function confirmNotificationApi(telegramUserId, tags) {
  const requestConfig = {
    method: 'POST',
    url: 'notification/confirm',
    data: { telegramUserId, tags },
  };

  return greenhouseApiClient.request(requestConfig).then(res => res.data);
}

export async function disableNotificationTag(telegramUserId, tag) {
  const requestConfig = {
    method: 'POST',
    url: 'notification/disable-tag',
    data: { telegramUserId, tag },
  };

  return greenhouseApiClient.request(requestConfig).then(res => res.data);
}
