const { SlashCommandBuilder } = require("discord.js");

//controllers
const AccountController = require("../controllers/account");

//commmands
module.exports = [
  {
    // news
    data: new SlashCommandBuilder()
      .setName("news")
      .setDescription("Get the latest news from valve dota2"),
    async execute(interaction) {
      await interaction.reply("News");
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
