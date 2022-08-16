const { Client, GatewayIntentBits, Collection } = require("discord.js");
const initializeCommands = require("./command-builders/handlers/initialize");
require("dotenv").config();

//apply fallback just in case
const token = process.env.DISCORD_BOT_TOKEN || "";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

initializeCommands(client);

client.once("ready", () => {
  console.log("Gaben has arise!");
  client.on("interactionCreate", async (interaction) => {
    //if its not a command - ignore
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  });
});

client.login(token);
