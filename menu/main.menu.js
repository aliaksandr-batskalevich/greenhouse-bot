import { MenuTemplate } from 'grammy-inline-menu';
import tempSensor from './temp-sensor.menu.js';
import greenhouse from './greenhouse.menu.js';

const mainMenu = new MenuTemplate(ctx => {
  return {
    text: `*📜 Main menu*`,
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  };
});

mainMenu.submenu('greenhouse', greenhouse, {
  text: '🏡 Greenhouse',
});

mainMenu.submenu('temp-sensors', tempSensor, {
  text: '🌡 Temp Sensors',
});

export default mainMenu;
