import * as NotificationApi from '../api/notification.api.js';

export const confirmNotification = async (telegramUserId, tags) => {
  try {
    await NotificationApi.confirmNotificationApi(telegramUserId, tags);
  } catch (e) {
    console.log(e);
  }
};

export const disableNotificationTag = async (telegramUserId, tag) => {
  try {
    await NotificationApi.disableNotificationTag(telegramUserId, tag);
  } catch (e) {
    console.log(e);
  }
};
