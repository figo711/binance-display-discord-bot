const dotenv = require('dotenv');
const { Client, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const Binance = require('node-binance-api');

const formatter = Intl.NumberFormat('en', { minimumFractionDigits: 9 });

const CONFIG = require('./config.json');
const CURS = CONFIG.list;

let currentI = 1;

dotenv.config();

console.log('DEBUG');
//console.log(process.env.D_TOKEN);
//console.log(process.env.B_TOKEN);

const binance = new Binance();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences],
});

const updateActivity = (value) => {
	const act = { name: value, type: ActivityType.Watching };
	client.user.setActivity(act);
};

client.once(Events.ClientReady, c => {
	console.log(`${getCurTime()}: Ready! Logged in as ${c.user.tag}`);

	updateActivity('Null');
	setInterval(updateFunc, 1000 * CONFIG.interval);
});

client.login(process.env.D_TOKEN);

const getCurTime = () => {
	const ts = Date.now();

	const date1 = new Date(ts);
	const h = date1.getHours();
	const m = date1.getMinutes();
	const s = date1.getSeconds();
	return `${h}:${m}:${s}`;
};

const updateFunc = () => {
	const time = getCurTime();
	console.log(`${time}: Simulate update activity!`);

	binance.prices(CURS[currentI].coin, (error, ticker) => {
		if (!error) {
			const val = formatter.format(ticker[CURS[currentI].coin]);
			console.log(`${getCurTime()} Price: ${CURS[currentI].style} ${val}`);
			updateActivity(`${CURS[currentI].style} ${val}`);
			currentI++;
			if (currentI >= CURS.length) currentI = 0;
		}
		else {
			console.log(`${getCurTime()} ERROR: ${error}`);
		}
	});
};
