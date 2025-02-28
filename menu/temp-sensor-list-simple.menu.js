import { MenuTemplate } from 'grammy-inline-menu';
import backMenuButtons from '../common/back-menu-buttons.js';
import { Location } from '../interfaces/location.interface.js';
import * as TempSensorsService from '../services/temp-sensor.service.js';

const tempSensorsListSimple = new MenuTemplate(async (ctx, path) => {
  let location;
  try {
    location = parseLocationFromPath(path);
  } catch (e) {
    console.log(e);
  }
  let text = `*📋 Датчики температуры ${location}*\n\n`;

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
tempSensorsListSimple.manualRow(backMenuButtons());

function parseLocationFromPath(path) {
  if (path.includes('nehachevo')) {
    return Location.NEHACHEVO;
  }
  if (path.includes('ivatsevichi')) {
    return Location.IVATSEVICHI;
  }
  throw new Error('Unknown location');
}

export default tempSensorsListSimple;
