import { whiteList } from '../white-list.js';

export const whiteListMiddleware = async (ctx, next) => {
  if (!ctx.from?.id) return;
  if (!whiteList.includes(ctx.from.id)) {
    await ctx.reply(`User \@${ctx.from.id} is not whitelisted!`);
    return;
  }
  return next();
};
