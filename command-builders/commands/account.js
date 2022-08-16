const { SlashCommandBuilder } = require("discord.js");

//commmands
module.exports = [
  {
    //news
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
      .setDescription("Summary of steam player's profile"),
    async execute(interaction) {
      await interaction.reply("Profile");
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
      .setDescription("Register your account to access commands"),
    async execute(interaction) {
      await interaction.reply("Register account");
    },
  },
];
