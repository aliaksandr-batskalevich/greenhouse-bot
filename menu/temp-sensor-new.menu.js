import { deleteMenuFromContext, MenuTemplate, replyMenuToContext } from 'grammy-inline-menu';
import { StatelessQuestion } from '@grammyjs/stateless-question';
import backMenuButtons from '../common/back-menu-buttons.js';
import { Location } from '../interfaces/location.interface.js';
import * as TempSensorService from '../services/temp-sensor.service.js';
import * as GreenhouseService from '../services/greenhouse.service.js';
import tempSensors from './temp-sensor.menu.js';
import { sleep } from '../utils/sleep.util.js';

const locationSelector = new MenuTemplate(ctx => {
  return {
    text: 'Select Location',
    parse_mode: 'Markdown',
  };
});
locationSelector.interact('nehachevo', {
  text: 'NEHACHEVO',
  do: async ctx => {
    ctx['session']['newTempSensor']['location'] = Location.NEHACHEVO;
    await replyMenuToContext(tempSensorNew, ctx, 'temp-sensor-new/');
    await ctx.answerCallbackQuery();
    return true;
  },
});
locationSelector.interact('ivatsevichi', {
  text: Location.IVATSEVICHI,
  do: async ctx => {
    ctx['session']['newTempSensor']['location'] = Location.IVATSEVICHI;
    await replyMenuToContext(tempSensorNew, ctx, 'temp-sensor-new/');
    await ctx.answerCallbackQuery();
    return true;
  },
});
locationSelector.manualRow(backMenuButtons());

const greenhouseSelector = new MenuTemplate((ctx) => {
  return {
    text: '*🏡 Select greenhouse*',
    parse_mode: 'Markdown',
  };
});
greenhouseSelector.choose('select', {
  choices: (ctx) => {
    return ctx['session']['newTempSensor']['greenhouses']
      .map((_g, i) => i);
  },
  buttonText: (ctx, key) => {
    const greenhouse = ctx['session']['newTempSensor']['greenhouses'][Number(key)];
    return greenhouse['name'];
  },
  columns: 1,
  do: async (ctx, key) => {
    const greenhouse = ctx['session']['newTempSensor']['greenhouses'][Number(key)];
    ctx['session']['newTempSensor']['greenhouseId'] = greenhouse['id'];
    await replyMenuToContext(tempSensorNew, ctx, 'temp-sensor-new/');
    await ctx.answerCallbackQuery();
    return true;
  },
});
greenhouseSelector.manualRow(backMenuButtons());


const tempSensorNew = new MenuTemplate(async (ctx) => {
  const {
    location,
    greenhouseId,
    name,
    sn,
    positionX,
    positionY,
    minTemp,
    maxTemp,
  } = ctx['session']['newTempSensor'];

  const greenhouses = await GreenhouseService.getGreenhouses(location);
  ctx['session']['newTempSensor']['greenhouses'] = greenhouses;
  const greenhouse = greenhouses.find((g) => g['id'] === greenhouseId);
  if (!greenhouse) {
    ctx['session']['newTempSensor']['greenhouseId'] = undefined;
  }

  let text = '*🌡 New Temp Sensor*\n\n';
  text += `*🌐 Location:* ${location}\n`;
  text += `*🏡 Greenhouse:* ${greenhouse ? greenhouse['name'] : 'not set'}\n`;
  text += `*📍 Position X:* ${positionX || 'not set'}\n`;
  text += `*📍 Position Y:* ${positionY || 'not set'}\n`;
  text += `*#️⃣ S/n:* ${sn || 'not set'}\n`;
  text += `*📝 Name:* ${name || 'not set'}\n`;
  text += `*📉 Min Temp (optional):* ${minTemp ? minTemp + '°' : 'not set'}\n`;
  text += `*📈 Max Temp (optional):* ${maxTemp ? maxTemp + '°' : 'not set'}\n`;

  return {
    text,
    parse_mode: 'Markdown',
  };
});
tempSensorNew.submenu('location', locationSelector, {
  text: '🌐 Location',
});
tempSensorNew.submenu('greenhouses', greenhouseSelector, {
  text: '🏡 Greenhouse',
});
tempSensorNew.interact('set-temp-sensor-position', {
  text: '📍 Position',
  do: async (ctx) => {
    if (!ctx['session']['newTempSensor']['greenhouseId']) {
      await ctx.reply('Greenhouse not set');
      await ctx.answerCallbackQuery();
      await sleep(1000);
      await replyMenuToContext(tempSensorNew, ctx, 'temp-sensor-new/');
      return false;
    }

    await newTempSensorPositionXQuestion.replyWithMarkdown(
      ctx,
      'Enter sensor position by X',
    );
    await ctx.answerCallbackQuery();
    return false;
  },
});
tempSensorNew.interact('set-temp-sensor-sn', {
  text: '#️⃣ S/n',
  do: async ctx => {
    await newTempSensorSNQuestion.replyWithMarkdown(
      ctx,
      `Enter temp sensor serial number "T..."`,
    );
    await ctx.answerCallbackQuery();
    return false;
  },
});
tempSensorNew.interact('set-temp-sensor-name', {
  text: '📝 Name',
  do: async (ctx) => {
    await newTempSensorNameQuestion.replyWithMarkdown(
      ctx,
      'Enter the temp sensor name from 4 to 16 characters',
    );
    await ctx.answerCallbackQuery();
    return false;
  },
});
tempSensorNew.interact('set-temp-sensor-min-temp', {
  text: '📉 Min temp',
  do: async (ctx) => {
    await newTempSensorMinTempQuestion.replyWithMarkdown(
      ctx,
      `Enter min temp as XX.XX or "-" for remove option`,
    );
    await ctx.answerCallbackQuery();
    return false;
  },
});
tempSensorNew.interact('set-temp-sensor-max-temp', {
  text: '📈 Max temp',
  do: async (ctx) => {
    await newTempSensorMaxTempQuestion.replyWithMarkdown(
      ctx,
      `Enter max temp as XX.XX or "-" for remove option`,
    );
    await ctx.answerCallbackQuery();
    return false;
  },
});
tempSensorNew.interact('menu-close', {
  text: '❌ Close',
  do: async ctx => {
    await deleteMenuFromContext(ctx);
    return false;
  },
});
tempSensorNew.interact('save-temp-sensor-new', {
  text: '💾 Save',
  do: async (ctx) => {
    if (
      !ctx['session']['newTempSensor']['greenhouseId']
      || !ctx['session']['newTempSensor']['positionX'] === undefined
      || !ctx['session']['newTempSensor']['positionY'] === undefined
      || !ctx['session']['newTempSensor']['sn']
      || !ctx['session']['newTempSensor']['name']
    ) {
      await ctx.reply('Required data not set.');
      await ctx.answerCallbackQuery();
      await sleep(800);
      await replyMenuToContext(tempSensorNew, ctx, 'temp-sensor-new/');
      return false;
    }
    await saveTempSensor(ctx['session']['newTempSensor']);
    await ctx.answerCallbackQuery();
    await ctx.reply(`Temp sensor ${ctx['session']['newTempSensor']['name']} created successfully`);
    await sleep(800);
    await replyMenuToContext(tempSensors, ctx, '/temp-sensors/');
    return false;
  },
  joinLastRow: true,
});

export const newTempSensorSNQuestion = new StatelessQuestion(
  'set-temp-sensor-sn-question',
  async (ctx) => {
    if (!ctx.message.text.length) {
      await newTempSensorSNQuestion.replyWithMarkdown(
        ctx,
        `S/n is required option`,
      );
      return false;
    }
    const sensor = await TempSensorService.checkTempSensorSn(ctx.message.text);
    if (sensor) {
      await newTempSensorSNQuestion.replyWithMarkdown(
        ctx,
        `Sensor with S/n <${ctx.message.text}> already exist`,
      );
      return false;
    }

    ctx['session']['newTempSensor']['sn'] = ctx.message.text;

    await replyMenuToContext(tempSensorNew, ctx, 'temp-sensor-new/');
    return false;
  },
);

export const newTempSensorNameQuestion = new StatelessQuestion(
  'set-temp-sensor-name-question',
  async (ctx) => {
    if (ctx.message.text.length < 4 || ctx.message.text.length > 16) {
      await newTempSensorNameQuestion.replyWithMarkdown(
        ctx,
        `The name length must be at least 4 and no more than 16 characters`,
      );
      return false;
    }
    const sensor = await TempSensorService.checkTempSensorName(ctx.message.text);
    if (sensor) {
      await newTempSensorNameQuestion.replyWithMarkdown(
        ctx,
        `Sensor with name <${ctx.message.text}> already exist`,
      );
      return false;
    }

    ctx['session']['newTempSensor']['name'] = ctx.message.text;

    await replyMenuToContext(tempSensorNew, ctx, 'temp-sensor-new/');
    return false;
  },
);
export const newTempSensorPositionYQuestion = new StatelessQuestion(
  'set-position-y-question',
  async (ctx) => {
    if (!Number.isFinite(Number(ctx.message.text))) {
      await newTempSensorPositionYQuestion.replyWithMarkdown(
        ctx,
        `The value must consist of numbers`,
      );
      return false;
    }

    const tempSensor = await TempSensorService.checkTempSensorPosition(
      ctx['session']['newTempSensor']['greenhouseId'],
      ctx['session']['newTempSensor']['positionX'],
      Number(ctx.message.text),
    );
    if (tempSensor) {
      await newTempSensorPositionYQuestion.replyWithMarkdown(
        ctx,
        `Sensor on this position already exist. Enter position by Y again.`,
      );
      return false;
    }

    ctx['session']['newTempSensor']['positionY'] = Number.parseInt(ctx.message.text);

    await replyMenuToContext(tempSensorNew, ctx, 'temp-sensor-new/');
    return false;
  },
);
export const newTempSensorPositionXQuestion = new StatelessQuestion(
  'set-position-x-question',
  async (ctx) => {
    if (!Number.isFinite(Number(ctx.message.text))) {
      await newTempSensorPositionXQuestion.replyWithMarkdown(
        ctx,
        `The value must consist of numbers`,
      );
      return false;
    }

    ctx['session']['newTempSensor']['positionX'] = Number.parseInt(ctx.message.text);

    await newTempSensorPositionYQuestion.replyWithMarkdown(
      ctx,
      'Enter sensor position by Y',
    );
    return false;
  },
);
export const newTempSensorMinTempQuestion = new StatelessQuestion(
  'set-min-temp-question',
  async (ctx) => {
    if (!Number.isFinite(Number(ctx.message.text)) && ctx.message.text !== '-') {
      await newTempSensorMinTempQuestion.replyWithMarkdown(
        ctx,
        `The value must consist of numbers`,
      );
      return false;
    }

    if (ctx.message.text === '-') {
      ctx['session']['newTempSensor']['minTemp'] = undefined;
    } else {
      ctx['session']['newTempSensor']['minTemp'] = Number(ctx.message.text).toFixed(2);
    }

    await replyMenuToContext(tempSensorNew, ctx, 'temp-sensor-new/');
    return false;
  },
);

export const newTempSensorMaxTempQuestion = new StatelessQuestion(
  'set-max-temp-question',
  async (ctx) => {
    if (!Number.isFinite(Number(ctx.message.text)) && ctx.message.text !== '-') {
      await newTempSensorMaxTempQuestion.replyWithMarkdown(
        ctx,
        `The value must consist of numbers`,
      );
      return false;
    }

    if (ctx.message.text === '-') {
      ctx['session']['newTempSensor']['maxTemp'] = undefined;
    } else {
      ctx['session']['newTempSensor']['maxTemp'] = Number(ctx.message.text).toFixed(2);
    }

    await replyMenuToContext(tempSensorNew, ctx, 'temp-sensor-new/');
    return false;
  },
);

const saveTempSensor = async (tempSensor) =>
  TempSensorService.saveNewTempSensor(
    tempSensor['greenhouseId'],
    tempSensor['positionX'],
    tempSensor['positionY'],
    tempSensor['sn'],
    tempSensor['name'],
    tempSensor['minTemp'],
    tempSensor['maxTemp'],
  );

export default tempSensorNew;
