const TelegramBot = require('node-telegram-bot-api');
const Querier = require('./querier');
const Promise = require('bluebird');
const moment = require('moment');
const FirebaseSync = require('./fbsync');
const fetch = require('node-fetch');
fetch.Promise = Promise;

let bot = null;

class Bot {
    constructor(firebase, querier, telegramBot, config, process) {
        this.config = config;
        this.lastDiscloseDate = null;
        this.process = process;
        this.firebase = firebase;
        this.querier = querier;
        this.telegramBot = telegramBot;
    }

    formatDate(strDate) {
        return moment(strDate).utc().format('YYYY-MM-DD HH:mm:ss UTC+0');
    }

    escapeChars(text) {
        return text.replace(/([\\\`\*\_\{\}\[\]\(\)\#\+\-\.\!])/g, '\\$1');
    }

    createMessage(node) {
        return `_Hacktivity_ from *${this.escapeChars(node.reporter.username)}* 
\`\`\`text \n${this.escapeChars(node.title)}\`\`\` 
${node.url}
*Disclosed at:* ${this.formatDate(node.disclosed_at)}
*Created at:* ${this.formatDate(node.created_at)}`
    }

    async go() {
        const alive = await fetch(this.config.baseURL);
        this.process.send(`alive ${this.config.baseURL} status: ${alive.status}`);

        this.process.send('Bot not sleeping!');
        if (!this.lastDiscloseDate) {
            this.lastDiscloseDate = await this.firebase.get('hackerone/last_disclose_date');
        }

        this.process.send(`lastDiscloseDate: ${this.lastDiscloseDate}`);

        const response = await this.querier.queryReports({
            disclosed_at: this.lastDiscloseDate
        });

        if (!response.data) {
            this.process.send(`[WARNING] No response data: ${JSON.stringify(response)}`);
            return;
        }

        this.process.send(`Received: ${response.data.reports.edges.length} records`);
        response.data.reports.edges.sort(
            (a, b) => ((a.node.disclosed_at < b.node.disclosed_at) ? -1 : ((a.node.disclosed_at > b.node.disclosed_at) ? 1 : 0))
        );

        const reports = response.data.reports.edges.filter(r => r.node.disclosed_at !== this.lastDiscloseDate);

        this.process.send(`But ${reports.length ? 'found' : 'not found'} new records!`);

        if (reports.length > 0) {
            this.lastDiscloseDate = reports[reports.length - 1].node.disclosed_at;
            await this.firebase.put('hackerone/last_disclose_date', this.lastDiscloseDate);
        }

        await Promise.mapSeries(reports, (report) => {
            return new Promise(async (resolve) => {
                await this.telegramBot.sendMessage(
                    this.config.chatId,
                    this.createMessage(report.node), {
                        parse_mode: 'Markdown'
                    }
                );
                this.process.send(this.createMessage(report.node));
                setTimeout(resolve, 2000);
            });
        });
    }
}


process.on('message', async (data) => {
    const message = JSON.parse(data);
    if (message.type === 'START' && !bot) {
        const config = message.payload;
        const querier = new Querier(config);
        const firebase = new FirebaseSync(config);
        const telegramBot = new TelegramBot(config.token, {
            polling: true
        });

        if (!bot) {
            bot = new Bot(
                firebase, 
                querier, 
                telegramBot, 
                config, 
                process
            );
        }
        process.send('-------------------------- running bot loop ------------------------');
        function loop()  {
            return bot.go().then(() => setTimeout(loop, 1000 * config.intervalInSeconds));
        }
        await loop();
    }

    process.send('OK');    
});