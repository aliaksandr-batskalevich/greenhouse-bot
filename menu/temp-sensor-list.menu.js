import { MenuTemplate, replyMenuToContext } from 'grammy-inline-menu';
import backMenuButtons from '../common/back-menu-buttons.js';
import { Location } from '../interfaces/location.interface.js';
import * as TempSensorsService from '../services/temp-sensor.service.js';
import tempSensorEdit from './temp-sensor-edit.menu.js';

const tempSensorsList = new MenuTemplate(async ctx => {
  let location;
  try {
    location = parseLocationFromCtx(ctx);
  } catch (e) {
    console.log(e);
  }
  let text = `*📋 Temp sensors list ${location}*\n\n`;

  const sensors = await TempSensorsService.getTempSensors(location);
  if (!ctx['session']) {
    ctx['session'] = {};
  }
  ctx['session']['tempSensors'] = sensors;

  for (const sensor of sensors) {
    const label = sensor['active'] ? '🟢' : '🔴';
    text += `${label} "${sensor['name']}" - *${sensor['lastTemp'] ? sensor['lastTemp'] + '°' : '🚫'}*`;
    if (sensor['delta'] !== undefined) {
      text += ` (${sensor['delta'] > 0 ? '+' + sensor['delta'] + '°' : sensor['delta'] + '°'})`;
    }
    text += '\n';
  }
  if (!sensors.length) {
    text += `No sensors yet.`;
  }

  return {
    text,
    parse_mode: 'Markdown',
  };
});
tempSensorsList.choose('select', {
  choices: (ctx) => {
    return ctx['session']['tempSensors'].map((_s, i) => i);
  },
  buttonText: (ctx, key) => {
    const sensor = ctx['session']['tempSensors'][Number(key)];
    let text = `✏ "${sensor['name']}"`;
    text += ` (min: ${sensor['minTemp'] ? sensor['minTemp'] + '°' : 'no'} & max: ${sensor['maxTemp'] ? sensor['maxTemp'] + '°' : 'no'})`

    return text;
  },
  do: async (ctx, key) => {
    const sensor = ctx['session']['tempSensors'][Number(key)];
    ctx['session']['editTempSensor'] = sensor;

    await replyMenuToContext(tempSensorEdit, ctx, `temp-edit/`);
    await ctx.answerCallbackQuery();
    return true;
  },
  columns: 1,
});
tempSensorsList.manualRow(backMenuButtons());

function parseLocationFromCtx(ctx) {
  const path = ctx.match[0].split('/')[2];

  if (path.includes('nehachevo')) {
    return Location.NEHACHEVO;
  }
  if (path.includes('ivatsevichi')) {
    return Location.IVATSEVICHI;
  }
  throw new Error('Unknown location');
}

export default tempSensorsList;
