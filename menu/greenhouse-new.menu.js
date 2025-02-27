import {
  deleteMenuFromContext,
  MenuTemplate,
  replyMenuToContext,
} from 'grammy-inline-menu';
import { StatelessQuestion } from '@grammyjs/stateless-question';
import backMenuButtons from '../common/back-menu-buttons.js';
import { Location } from '../interfaces/location.interface.js';
import * as GreenhouseService from '../services/greenhouse.service.js';
import greenhouse from './greenhouse.menu.js';

const locationSelector = new MenuTemplate(ctx => {
  return {
    text: 'Select Location',
    parse_mode: 'Markdown',
  };
});
locationSelector.interact('nehachevo', {
  text: 'NEHACHEVO',
  do: async ctx => {
    ctx['session']['newGreenhouse']['location'] = Location.NEHACHEVO;
    await replyMenuToContext(greenhouseNew, ctx, 'greenhouse-new/');
    await ctx.answerCallbackQuery();
    return true;
  },
});
locationSelector.interact('ivatsevichi', {
  text: Location.IVATSEVICHI,
  do: async ctx => {
    ctx['session']['newGreenhouse']['location'] = Location.IVATSEVICHI;
    await replyMenuToContext(greenhouseNew, ctx, 'greenhouse-new/');
    await ctx.answerCallbackQuery();
    return true;
  },
});
locationSelector.manualRow(backMenuButtons());

const greenhouseNew = new MenuTemplate(ctx => {
  let text = '*🏡 New Greenhouse*\n\n';
  text += `*🌐 Location:* ${ctx['session']['newGreenhouse']['location']}\n`;
  text += `*📝 Name:* ${ctx['session']['newGreenhouse']['name']}\n`;
  text += `*📏 Sizes (WxL):* ${ctx['session']['newGreenhouse']['width']} x ${ctx['session']['newGreenhouse']['length']} m\n`;

  return {
    text,
    parse_mode: 'Markdown',
  };
});
greenhouseNew.submenu('location', locationSelector, {
  text: '🌐 Change Location',
});
greenhouseNew.interact('change-greenhouse-name', {
  text: '📝 Change name',
  do: async ctx => {
    await newGreenhouseNameQuestion.replyWithMarkdown(
      ctx,
      'Enter the greenhouse name from 4 to 16 characters',
    );
    await ctx.answerCallbackQuery();
    return false;
  },
});
greenhouseNew.interact('change-greenhouse-sizes', {
  text: '📏 Change sizes',
  do: async ctx => {
    await newGreenhouseWidthQuestion.replyWithMarkdown(
      ctx,
      'Enter greenhouse width (m)',
    );
    await ctx.answerCallbackQuery();
    return false;
  },
});
greenhouseNew.interact('menu-close', {
  text: '❌ Close',
  do: async ctx => {
    await deleteMenuFromContext(ctx);
    return false;
  },
});
greenhouseNew.interact('save-greenhouse-new', {
  text: '💾 Save',
  do: async ctx => {
    if (
      !ctx['session']['newGreenhouse']['length'] ||
      !ctx['session']['newGreenhouse']['width']
    ) {
      await ctx.answerCallbackQuery();
      return false;
    }
    await saveGreenhouse(ctx['session']['newGreenhouse']);
    await ctx.answerCallbackQuery();
    await replyMenuToContext(greenhouse, ctx, '/greenhouse/');
    return false;
  },
  joinLastRow: true,
});

export const newGreenhouseNameQuestion = new StatelessQuestion(
  'change-greenhouse-name-question',
  async ctx => {
    if (ctx.message.text.length < 4 || ctx.message.text.length > 16) {
      await newGreenhouseNameQuestion.replyWithMarkdown(
        ctx,
        `The name length must be at least 4 and no more than 16 characters`,
      );
      return false;
    }

    ctx['session']['newGreenhouse']['name'] = ctx.message.text;

    await replyMenuToContext(greenhouseNew, ctx, 'greenhouse-new/');
    return false;
  },
);
export const newGreenhouseLengthQuestion = new StatelessQuestion(
  'change-greenhouse-length-question',
  async ctx => {
    if (!Number.isFinite(Number(ctx.message.text))) {
      await newGreenhouseNameQuestion.replyWithMarkdown(
        ctx,
        `The value must consist of numbers`,
      );
      return false;
    }

    ctx['session']['newGreenhouse']['length'] = Math.round(
      Number(ctx.message.text),
    );

    await replyMenuToContext(greenhouseNew, ctx, 'greenhouse-new/');
    return false;
  },
);
export const newGreenhouseWidthQuestion = new StatelessQuestion(
  'change-greenhouse-width-question',
  async ctx => {
    if (!Number.isFinite(Number(ctx.message.text))) {
      await newGreenhouseNameQuestion.replyWithMarkdown(
        ctx,
        `The value must consist of numbers`,
      );
      return false;
    }

    ctx['session']['newGreenhouse']['width'] = Math.round(
      Number(ctx.message.text),
    );

    await newGreenhouseLengthQuestion.replyWithMarkdown(
      ctx,
      'Enter greenhouse length (m)',
    );
    return false;
  },
);

const saveGreenhouse = async greenhouse =>
  GreenhouseService.saveNewGreenhouse(
    greenhouse['name'],
    greenhouse['location'],
    greenhouse['width'],
    greenhouse['length'],
  );

export default greenhouseNew;
