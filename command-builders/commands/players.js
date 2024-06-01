const { SlashCommandBuilder } = require("discord.js");

//controllers
const PlayersController = require("../controllers/players");

//commmands
module.exports = [
  {
    // active live games
    data: new SlashCommandBuilder()
      .setName("search_player")
      .setDescription("Search player by name")
      .addStringOption((option) =>
        option
          .setName(PlayersController.constants.SEARCH_PLAYER)
          .setDescription("search player by in game name")
          .setRequired(true)
      ),
    async execute(interaction) {
      await PlayersController.search_player(interaction);
    },
  }
];
