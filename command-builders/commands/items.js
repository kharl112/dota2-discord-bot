const { SlashCommandBuilder } = require("discord.js");

//controllers
const ItemsController = require("../controllers/items");

//commmands
module.exports = [
  {
    // active live games
    data: new SlashCommandBuilder()
      .setName("search_item")
      .setDescription("Search item by name")
      .addStringOption((option) =>
        option
          .setName(ItemsController.constants.SEARCH_ITEM)
          .setDescription("search item details")
          .setRequired(true)
      ),
    async execute(interaction) {
      await ItemsController.search_item(interaction);
    },
  }
];
