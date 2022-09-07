const { SlashCommandBuilder } = require("discord.js");

//controllers
const AccountController = require("../controllers/account");

//commmands
module.exports = [
  {
    // active live games
    data: new SlashCommandBuilder()
      .setName("live")
      .setDescription("Get the latest live league games from dota2")
      .addStringOption((option) =>
        option
          .setName(AccountController.constants.SEARCH_LIVE)
          .setDescription("search for in-game teams")
          .setRequired(true)
      ),
    async execute(interaction) {
      await AccountController.live(interaction);
    },
  },
  {
    //profile
    data: new SlashCommandBuilder()
      .setName("profile")
      .setDescription("Summary of steam player's profile")
      .addUserOption((option) =>
        option
          .setName(AccountController.constants.USER_OPTION)
          .setDescription("please provide or metion anybody if necessary")
          .setRequired(false)
      ),
    async execute(interaction) {
      await AccountController.profile(interaction);
    },
  },
  {
    //friends
    data: new SlashCommandBuilder()
      .setName("friends")
      .setDescription("Get player's friend list"),
    async execute(interaction) {
      await interaction.reply("Friends");
    },
  },
  {
    //recently game played
    data: new SlashCommandBuilder()
      .setName("recent")
      .setDescription("Get player's recently played games"),
    async execute(interaction) {
      await interaction.reply("Recently played games");
    },
  },
  {
    //register account (steam & discord) to the database
    data: new SlashCommandBuilder()
      .setName("register")
      .setDescription("Register your account to access commands")
      .addStringOption((option) =>
        option
          .setName(AccountController.constants.INPUT_NAME)
          .setDescription("Please provide your steam ID to proceed")
          .setRequired(true)
      ),
    async execute(interaction) {
      await AccountController.register(interaction);
    },
  },
];
