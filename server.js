const moment = require('moment-timezone');
require('dotenv').config();
const jobs = require('./jobs.json');

const { Client, Intents, MessageEmbed } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.login(process.env.CLIENT_TOKEN);
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} at ${getCurrentTime()}!`);
  checkReminder();
  updateStatus();
});

function getCurrentTime() {
  const date = new Date();
  const time = moment(date).tz(`${process.env.TIMEZONE}`).format('HH:mm A - dddd');

  return time;
}

function getDay() {
  const date = new Date();
  const day = moment(date).tz(`${process.env.TIMEZONE}`).format('dddd');

  return day;
}

function getHours() {
  const date = new Date();
  const hours = moment(date).tz(`${process.env.TIMEZONE}`).format('HHmm');
  return hours;
}

function getEmbed(name, value, color) {
  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(`${name}`)
    .setDescription(`${value}`)

  return embed;
}

function updateStatus() {
  setInterval(() => {
    console.log(`Server time updated`);
    client.user.setActivity(getCurrentTime(), { type: 'PLAYING' });
    checkReminder();
  }, 60000);
}

async function checkReminder() {
  const reminderChannel = await client.channels.fetch(`${process.env.CHANNEL_ID}`);

  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i].time === getHours() && jobs[i].day === getDay()) {
      console.log('match 1 record');
      reminderChannel.send({
        content: `<@&${jobs[i].group}>`,
        embeds: [getEmbed(jobs[i].type, jobs[i].message, jobs[i].color)],
      });
    }
  }
}
