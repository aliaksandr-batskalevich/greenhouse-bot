import { deleteMenuFromContext, MenuTemplate, replyMenuToContext } from 'grammy-inline-menu';
import { StatelessQuestion } from '@grammyjs/stateless-question';
import * as TempSensorService from '../services/temp-sensor.service.js';
import tempSensors from './temp-sensor.menu.js';
import { sleep } from '../utils/sleep.util.js';


const tempSensorEdit = new MenuTemplate(async (ctx) => {
  const sensor = ctx['session']['editTempSensor'];

  let deltaView = '🚫';
  if (sensor['delta'] !== undefined) {
    deltaView = sensor['delta'] > 0 ? `+${sensor['delta']}°` : `${sensor['delta']}°`;
  }

  let text = `*🌡 Edit Temp Sensor "${sensor['name']}"*\n\n`;
  text += `*#️⃣ S/n:* ${sensor['sn'] || 'not set'}\n`;
  text += `*🌡 Last temp:* ${sensor['lastTemp'] ? sensor['lastTemp'] + '°' : '🚫'}\n`;
  text += `*⚖ Delta:* ${deltaView}\n`;
  text += `*📉 Min Temp (optional):* ${sensor['minTemp'] ? sensor['minTemp'] + '°' : 'not set'}\n`;
  text += `*📈 Max Temp (optional):* ${sensor['maxTemp'] ? sensor['maxTemp'] + '°' : 'not set'}\n`;

  return {
    text,
    parse_mode: 'Markdown',
  };
});
tempSensorEdit.interact('set-name', {
  text: '📝 Name',
  do: async (ctx) => {
    await editTempSensorNameQuestion.replyWithMarkdown(
      ctx,
      'Enter the temp sensor name from 4 to 16 characters',
    );
    await ctx.answerCallbackQuery();
    return false;
  },
});
tempSensorEdit.interact('set-min-temp', {
  text: '📉 Min temp',
  do: async (ctx) => {
    await editTempSensorMinTempQuestion.replyWithMarkdown(
      ctx,
      `Enter min temp as XX.XX or "-" for remove option`,
    );
    await ctx.answerCallbackQuery();
    return false;
  },
});
tempSensorEdit.interact('set-max-temp', {
  text: '📈 Max temp',
  do: async (ctx) => {
    await editTempSensorMaxTempQuestion.replyWithMarkdown(
      ctx,
      `Enter max temp as XX.XX or "-" for remove option`,
    );
    await ctx.answerCallbackQuery();
    return false;
  },
});
tempSensorEdit.interact('delete', {
  text: '❌ Delete',
  do: async (ctx) => {
    await deleteTempSensor(ctx['session']['editTempSensor']);
    await ctx.answerCallbackQuery();
    await ctx.reply(`Temp sensor ${ctx['session']['editTempSensor']['name']} deleted successfully`);
    await sleep(800);
    await replyMenuToContext(tempSensors, ctx, '/temp-sensors/');
    return false;
  },
});
tempSensorEdit.interact('save', {
  text: '💾 Save',
  do: async (ctx) => {
    await saveTempSensor(ctx['session']['editTempSensor']);
    await ctx.answerCallbackQuery();
    await ctx.reply(`Temp sensor ${ctx['session']['editTempSensor']['name']} updated successfully`);
    await sleep(800);
    await replyMenuToContext(tempSensors, ctx, '/temp-sensors/');
    return false;
  },
  joinLastRow: true,
});
tempSensorEdit.interact('activate', {
  text: '🟢 Activate',
  do: async (ctx) => {
    await activateTempSensor(ctx['session']['editTempSensor']);
    await ctx.answerCallbackQuery();
    await ctx.reply(`Temp sensor ${ctx['session']['editTempSensor']['name']} activated successfully`);
    await sleep(800);
    await replyMenuToContext(tempSensors, ctx, '/temp-sensors/');
    return false;
  },
  hide: (ctx) => {
    return ctx['session']['editTempSensor']['active'];
  }
});
tempSensorEdit.interact('deactivate', {
  text: '🔴 Deactivate',
  do: async (ctx) => {
    await deactivateTempSensor(ctx['session']['editTempSensor']);
    await ctx.answerCallbackQuery();
    await ctx.reply(`Temp sensor ${ctx['session']['editTempSensor']['name']} deactivated successfully`);
    await sleep(800);
    await replyMenuToContext(tempSensors, ctx, '/temp-sensors/');
    return false;
  },
  hide: (ctx) => {
    return !ctx['session']['editTempSensor']['active'];
  }
});

tempSensorEdit.interact('menu-close', {
  text: '✖ Close',
  do: async ctx => {
    await deleteMenuFromContext(ctx);
    return false;
  },
});

export const editTempSensorNameQuestion = new StatelessQuestion(
  'name-question',
  async (ctx) => {
    if (ctx.message.text.length < 4 || ctx.message.text.length > 16) {
      await editTempSensorNameQuestion.replyWithMarkdown(
        ctx,
        `The name length must be at least 4 and no more than 16 characters`,
      );
      return false;
    }
    const sensor = await TempSensorService.checkTempSensorName(ctx.message.text);
    if (sensor) {
      await editTempSensorNameQuestion.replyWithMarkdown(
        ctx,
        `Sensor with name <${ctx.message.text}> already exist`,
      );
      return false;
    }

    ctx['session']['editTempSensor']['name'] = ctx.message.text;

    await replyMenuToContext(tempSensorEdit, ctx, 'temp-edit/');
    return false;
  },
);

export const editTempSensorMinTempQuestion = new StatelessQuestion(
  'min-temp-question',
  async (ctx) => {
    if (!Number.isFinite(Number(ctx.message.text)) && ctx.message.text !== '-') {
      await editTempSensorMinTempQuestion.replyWithMarkdown(
        ctx,
        `The value must consist of numbers`,
      );
      return false;
    }

    if (ctx.message.text === '-') {
      ctx['session']['editTempSensor']['minTemp'] = undefined;
    } else {
      ctx['session']['editTempSensor']['minTemp'] = Number(ctx.message.text).toFixed(2);
    }

    await replyMenuToContext(tempSensorEdit, ctx, 'temp-edit/');
    return false;
  },
);

export const editTempSensorMaxTempQuestion = new StatelessQuestion(
  'max-temp-question',
  async (ctx) => {
    if (!Number.isFinite(Number(ctx.message.text)) && ctx.message.text !== '-') {
      await editTempSensorMaxTempQuestion.replyWithMarkdown(
        ctx,
        `The value must consist of numbers`,
      );
      return false;
    }

    if (ctx.message.text === '-') {
      ctx['session']['editTempSensor']['maxTemp'] = undefined;
    } else {
      ctx['session']['editTempSensor']['maxTemp'] = Number(ctx.message.text).toFixed(2);
    }

    await replyMenuToContext(tempSensorEdit, ctx, 'temp-edit/');
    return false;
  },
);

const saveTempSensor = async (tempSensor) =>
  TempSensorService.saveTempSensorChanges(
    tempSensor['id'],
    tempSensor['name'],
    tempSensor['minTemp'],
    tempSensor['maxTemp'],
  );

const deleteTempSensor = async (tempSensor) =>
  TempSensorService.deleteTempSensor(tempSensor['id']);

const activateTempSensor = async (tempSensor) =>
  TempSensorService.activateTempSensor(tempSensor['id']);

const deactivateTempSensor = async (tempSensor) =>
  TempSensorService.deactivateTempSensor(tempSensor['id']);

export default tempSensorEdit;
