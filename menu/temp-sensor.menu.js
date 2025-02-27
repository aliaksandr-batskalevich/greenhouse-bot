import { MenuTemplate, replyMenuToContext } from 'grammy-inline-menu';
import tempSensorsList from './temp-sensor-list.menu.js';
import backMenuButtons from '../common/back-menu-buttons.js';
import { Location } from '../interfaces/location.interface.js';
import tempSensorNew from './temp-sensor-new.menu.js';

const tempSensors = new MenuTemplate(ctx => {
  const text = '*🌡 Temp sensor menu*';
  return {
    text,
    parse_mode: 'Markdown',
  };
});
tempSensors.submenu('list-nehachevo', tempSensorsList, {
  text: '📋 Sensors List NEHACHEVO',
});
tempSensors.submenu('list-ivatsevichi', tempSensorsList, {
  text: '📋 Sensors List IVATSEVICHI',
});

tempSensors.interact('new', {
  do: async ctx => {
    if (!ctx['session']) {
      ctx['session'] = {};
    }
    ctx['session']['newTempSensor'] = {
      location: Location.NEHACHEVO,
    };
    await replyMenuToContext(tempSensorNew, ctx, 'temp-sensor-new/');
    await ctx.answerCallbackQuery();
    return true;
  },
  text: '🆕 New Sensor',
});
tempSensors.manualRow(backMenuButtons());

export default tempSensors;