import * as NotificationService from '../services/notification.service.js';

export const disableNotificationTag = async (ctx, next) => {
  const telegramUserId = ctx.callbackQuery?.from?.id;
  if (!telegramUserId) {
    return next();
  }

  if (!ctx.callbackQuery?.data?.includes('notification/disable-tag')) {
    return next();
  }

  const [, notificationTag] = ctx.callbackQuery.data.split(':');
  if (!notificationTag) {
    return next();
  }

  await NotificationService.disableNotificationTag(
    telegramUserId,
    notificationTag,
  );
  await ctx.answerCallbackQuery();
  await ctx.api.sendMessage(
    telegramUserId,
    `Оповещения от <${notificationTag}> отключены на 30 мин.`,
  );
  return next();
};
