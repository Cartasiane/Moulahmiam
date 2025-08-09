import { Telegraf, Markup, session } from 'telegraf';
import dotenv from 'dotenv';
import { initDb } from './db';
import { addExpense, setMax, getSummary, markPaid } from './store';

dotenv.config();
initDb();

const baseAmount = Number(process.env.BASE_AMOUNT || 0);

const bot = new Telegraf(process.env.BOT_TOKEN || '');
bot.use(session());

function mainMenu() {
  return Markup.keyboard([
    ['Ajouter un frais', 'Déclarer mon max'],
    ['Voir le résumé', "J'ai payé"],
  ]).resize();
}

bot.start((ctx) => ctx.reply('Bot prêt à calculer les frais !', mainMenu()));

bot.hears('Ajouter un frais', (ctx) => {
  ctx.session.step = 'expense_amount';
  ctx.reply('Montant du frais ?');
});

bot.hears('Déclarer mon max', (ctx) => {
  ctx.session.step = 'max_amount';
  ctx.reply('Quel est ton montant maximum ?');
});

bot.hears('Voir le résumé', (ctx) => {
  const { text } = getSummary(baseAmount);
  ctx.reply(text);
});

bot.hears("J'ai payé", (ctx) => {
  markPaid(ctx.from.id);
  ctx.reply('Paiement enregistré. Merci !');
});

bot.on('text', (ctx) => {
  const step = ctx.session.step;
  if (!step) return;
  const amount = parseFloat(ctx.message.text.replace(',', '.'));
  if (isNaN(amount)) {
    ctx.reply('Montant invalide, réessaie.');
    return;
  }
  if (step === 'expense_amount') {
    addExpense(ctx.from.id, amount);
    ctx.reply('Frais ajouté.', mainMenu());
    ctx.session.step = undefined;
  } else if (step === 'max_amount') {
    setMax(ctx.from.id, amount);
    ctx.reply('Montant max enregistré.', mainMenu());
    ctx.session.step = undefined;
  }
});

bot.launch().then(() => {
  console.log('Bot started');
});

export {}; // keep this file a module
