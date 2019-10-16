const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { fork } = require('child_process');
const forked = fork('./bot.js');

const config = {
  token: process.env['TELEGRAM_BBBOT_TOKEN'],
  chatId: process.env['TELEGRAM_BBBOT_CHANNEL'],
  uri: process.env['TELEGRAM_BBBOT_HACKERONE_GRAPHQL'],
  secret: process.env['TELEGRAM_BBBOT_FIREBASE_SECRET'],
  databaseURL: process.env['TELEGRAM_BBBOT_FIREBASE_DB_URL'],
  intervalInSeconds: Number(process.env['TELEGRAM_BBBOT_LOOP_INTERVAL_IN_SECONDS']),
  baseURL: process.env['TELEGRAM_BBBOT_BASE_URL']
};

forked.on('message', (data) => {
  console.warn('[BOT] say: ', data);
});

forked.send(JSON.stringify({ 
  type: 'START', 
  payload: config 
}));

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
