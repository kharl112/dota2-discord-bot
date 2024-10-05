const { SlashCommandBuilder } = require("discord.js");

//controllers
const NewsController = require("../controllers/news");

//commmands
module.exports = [
  {
    // active live games
    data: new SlashCommandBuilder()
      .setName("get_latest_news")
      .setDescription("Get the latest news/patch/update in dota2"),
    async execute(interaction) {
      await NewsController.latest_news(interaction);
    },
  }
];
