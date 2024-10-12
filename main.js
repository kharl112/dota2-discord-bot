const { Client, GatewayIntentBits, Collection, Intents } = require("discord.js");
const initializeCommands = require("./command-builders/handlers/initialize");
const initializeEvents = require("./event-handlers/handlers/initialize");
const { latest_news } = require("./command-builders/non-slash-commands/news.js");

require("dotenv").config();

//apply fallback just in case
const token = process.env.DISCORD_BOT_TOKEN || "";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,   GatewayIntentBits.MessageContent] });
client.commands = new Collection();

//initialization
initializeEvents(client);
initializeCommands(client);

//for non slash commands
client.on("messageCreate", (message) => {
  latest_news(message);
});


client.login(token);
