import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.start((ctx) => ctx.reply('Bot prêt à calculer les frais !'));

bot.launch().then(() => {
  console.log('Bot started');
});

export {}; // keep this file a module
