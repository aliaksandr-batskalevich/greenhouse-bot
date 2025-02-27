import { Bot, session } from 'grammy';
import { hydrateReply } from '@grammyjs/parse-mode';
import { MenuMiddleware, replyMenuToContext } from 'grammy-inline-menu';
import { CommandGroup } from '@grammyjs/commands';
import configs from './config/index.js';
import { whiteListMiddleware } from './middleware/white-list.middleware.js';
import { confirmNotification } from './middleware/confirm-notification.middleware.js';
import { disableNotificationTag } from './middleware/disable-notification-tag.middleware.js';
import mainMenu from './menu/main.menu.js';
import tempSensors from './menu/temp-sensor.menu.js';
import greenhouse from './menu/greenhouse.menu.js';
import greenhouseNew, {
  newGreenhouseNameQuestion,
  newGreenhouseWidthQuestion,
  newGreenhouseLengthQuestion,
} from './menu/greenhouse-new.menu.js';
import tempSensorNew, {
  newTempSensorPositionXQuestion,
  newTempSensorPositionYQuestion,
  newTempSensorSNQuestion,
  newTempSensorNameQuestion,
  newTempSensorMinTempQuestion,
  newTempSensorMaxTempQuestion,
} from './menu/temp-sensor-new.menu.js';
import tempSensorEdit, {
  editTempSensorNameQuestion,
  editTempSensorMinTempQuestion,
  editTempSensorMaxTempQuestion,
} from './menu/temp-sensor-edit.menu.js';

const bot = new Bot(configs.bot.token);

// Install the plugin
bot.use(hydrateReply);
bot.use(session());

// bot.use((ctx, next) => {
//     console.log(ctx);
//     next();
// })
bot.use(whiteListMiddleware);
bot.use(confirmNotification);
bot.use(disableNotificationTag);

bot.use(new MenuMiddleware('temp-sensors/', tempSensors).middleware());

const menuMiddleware = new MenuMiddleware('/', mainMenu);

const commands = new CommandGroup();

commands
  .command('start', 'Start')
  .addToScope({ type: 'default' }, ctx => menuMiddleware.replyToContext(ctx));
commands
  .command('menu', 'Main Menu')
  .addToScope({ type: 'default' }, ctx => menuMiddleware.replyToContext(ctx));
commands
  .command('greenhouse', 'Greenhouse')
  .addToScope({ type: 'default' }, ctx =>
    replyMenuToContext(greenhouse, ctx, '/greenhouse/'),
  );
commands
  .command('temp_sensors', 'Temp Sensors')
  .addToScope({ type: 'default' }, ctx =>
    replyMenuToContext(tempSensors, ctx, '/temp-sensors/'),
  );

await commands.setCommands(bot);
bot.use(commands);
bot.use(menuMiddleware);

bot.use(new MenuMiddleware('greenhouse-new/', greenhouseNew).middleware());
bot.use(new MenuMiddleware('temp-sensor-new/', tempSensorNew).middleware());
bot.use(new MenuMiddleware('temp-sensor-new/', tempSensorNew).middleware());
bot.use(new MenuMiddleware('temp-edit/', tempSensorEdit).middleware());

// QUESTIONS
bot.use(newGreenhouseNameQuestion.middleware());
bot.use(newGreenhouseWidthQuestion.middleware());
bot.use(newGreenhouseLengthQuestion.middleware());
bot.use(newTempSensorPositionXQuestion.middleware());
bot.use(newTempSensorPositionYQuestion.middleware());
bot.use(newTempSensorSNQuestion.middleware());
bot.use(newTempSensorNameQuestion.middleware());
bot.use(newTempSensorMinTempQuestion.middleware());
bot.use(newTempSensorMaxTempQuestion.middleware());
bot.use(editTempSensorNameQuestion.middleware());
bot.use(editTempSensorMinTempQuestion.middleware());
bot.use(editTempSensorMaxTempQuestion.middleware());

bot.catch(error => {
  console.log(error);
});

await bot.start({
  onStart() {
    console.log('Ok');
  },
});
