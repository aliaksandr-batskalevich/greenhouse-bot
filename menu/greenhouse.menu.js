import { MenuTemplate, replyMenuToContext } from 'grammy-inline-menu';
import greenhouseList from './greenhouse-list.menu.js';
import greenhouseNew from './greenhouse-new.menu.js';
import backMenuButtons from '../common/back-menu-buttons.js';
import { Location } from '../interfaces/location.interface.js';

const greenhouse = new MenuTemplate(ctx => {
  const text = '*🏡 Greenhouse menu*';
  return {
    text,
    parse_mode: 'Markdown',
  };
});
greenhouse.submenu('greenhouse-list:nehachevo', greenhouseList, {
  text: '📋 Greenhouse List NEHACHEVO',
});
greenhouse.submenu('greenhouse-list:ivatsevichi', greenhouseList, {
  text: '📋 Greenhouse List IVATSEVICHI',
});
greenhouse.interact('new', {
  text: '🆕 New Greenhouse',
  do: async ctx => {
    if (!ctx['session']) {
      ctx['session'] = {};
    }
    ctx['session']['newGreenhouse'] = {
      name: 'Simple Name',
      location: Location.NEHACHEVO,
      length: 0,
      width: 0,
    };
    await replyMenuToContext(greenhouseNew, ctx, 'greenhouse-new/');
    return true;
  },
});
greenhouse.manualRow(backMenuButtons());

export default greenhouse;
