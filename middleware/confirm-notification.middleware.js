import * as NotificationService from '../services/notification.service.js';

export const confirmNotification = async (ctx, next) => {
  const telegramUserId = ctx.callbackQuery?.from?.id;
  if (!telegramUserId) {
    return next();
  }

  if (!ctx.callbackQuery?.data?.includes('notification/confirm-view')) {
    return next();
  }

  const [, notificationTagsStr] = ctx.callbackQuery.data.split(':');
  if (!notificationTagsStr) {
    return next();
  }
  const notificationTags = notificationTagsStr.split('&');

  await NotificationService.confirmNotification(
    telegramUserId,
    notificationTags,
  );
  await ctx.answerCallbackQuery();
  await ctx.api.sendMessage(telegramUserId, 'Оповещение прочитано');
  return next();
};
