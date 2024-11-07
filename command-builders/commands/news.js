const { SlashCommandBuilder } = require("discord.js");

//controllers
const NewsController = require("../controllers/news");

//commmands
module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName("get_latest_news")
      .setDescription("Get the latest news/patch/update in dota2"),
    async execute(interaction) {
      await NewsController.latest_news(interaction);
    },
  },
  {
    data: new SlashCommandBuilder()
    .setName("get_latest_bugs")
    .setDescription("Get the latest bugs posted from r/Dota2"),
    async execute(interaction) {
      await NewsController.latest_bugs(interaction);
    },
  }
];
