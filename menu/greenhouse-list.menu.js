import { MenuTemplate } from 'grammy-inline-menu';
import backMenuButtons from '../common/back-menu-buttons.js';
import * as GreenhouseService from '../services/greenhouse.service.js';
import { Location } from '../interfaces/location.interface.js';

const greenhouseView = new MenuTemplate(async ctx => {
  const index = Number(ctx.match[1]);

  const greenhouse = ctx['session']['greenhouses'][index];

  let text = `*🏡 ${greenhouse['name']}*\n\n`;
  text += `🌐 Location: ${greenhouse['location']}\n`;
  if (greenhouse['length'] && greenhouse['width']) {
    text += `📏 Sizes (WxL): ${greenhouse['width']}x${greenhouse['length']} m\n`;
  }

  return { text, parse_mode: 'Markdown' };
});
greenhouseView.manualRow(backMenuButtons());

const greenhouseList = new MenuTemplate(async (ctx) => {
  const location = parseLocationFromCtx(ctx);
  const greenhouses = await GreenhouseService.getGreenhouses(location);
  if (!ctx['session']) {
    ctx['session'] = {};
  }
  ctx['session']['greenhouses'] = greenhouses;

  let text = `*📋 Greenhouse list ${location}*\n\n`;
  for (const greenhouse of greenhouses) {
    text += `🏡 "${greenhouse['name']}" (${greenhouse['width']} x ${greenhouse['length']} m)\n`;
  }

  return {
    text,
    parse_mode: 'Markdown',
  };
});
greenhouseList.chooseIntoSubmenu('view', greenhouseView, {
  choices: async (ctx) => {
    return ctx['session']['greenhouses'].map((_g, i) => i);
  },
  buttonText: (ctx, key) => {
    const greenhouse = ctx['session']['greenhouses'][Number(key)];
    return `✏ "${greenhouse['name']}" (${greenhouse['width']} x ${greenhouse['length']} m)`;
  },
  columns: 1,
});

greenhouseList.manualRow(backMenuButtons());

export default greenhouseList;

function parseLocationFromCtx(ctx) {
  const path = ctx.match[0].split(':')[1];

  if (path.includes('nehachevo')) {
    return Location.NEHACHEVO;
  }
  if (path.includes('ivatsevichi')) {
    return Location.IVATSEVICHI;
  }
  throw new Error('Unknown location');
}