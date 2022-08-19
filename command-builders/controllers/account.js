const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

//helpers
const Status = require("../../helpers/account_status");

//models
const User = require("../../database/models/user");

//constants
const INPUT_NAME = "steam_id";
const USER_OPTION = "member";

module.exports = (() => {
  const profile = async (interaction) => {
    try {
      //get the data from mentioned user
      const [mentioned] = interaction.options._hoistedOptions.filter(
        ({ name }) => name === USER_OPTION
      );

      const discord_id = mentioned ? mentioned.user.id : interaction.user.id;

      //get user from the database
      const user = await User.findOne({
        where: { discord_id },
      });

      //throw a error if not found
      if (!user) throw "user not found";

      //request player's data from steam api
      const request = await axios.get(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${
          process.env.STEAM_API_KEY
        }&steamids=${user.get("steam_id")}`
      );

      //data is empty? throw an error
      if (!request.data.response) throw "something wen't wrong";

      //get player's info and check if it exists
      const [player] = request.data.response.players;
      if (!player) throw "steam player not found";

      // inside a command, event listener, etc.
      const player_embed = new EmbedBuilder()
        .setColor(player.personastate ? 0x1ccc17 : 0x8b8b8b)
        .setTitle(player.personaname)
        .setDescription(
          player.gameextrainfo
            ? `Currently playing: ${player.gameextrainfo.toUpperCase()}`
            : "Not playing any games"
        )
        .setURL(player.profileurl)
        .setAuthor({
          name: player.realname ?? player.personaname,
          iconURL: player.avatarmedium,
          url: player.profileurl,
        })
        .addFields(
          {
            name: "Status",
            value: Status.getStatus(player.personastate),
            inline: true,
          },
          {
            name: "Last Opened Steam",
            value: new Date(player.lastlogoff * 1000).toLocaleString("en-us", {
              dateStyle: "medium",
            }),
            inline: true,
          }
        )
        .setThumbnail(player.avatar);

      await interaction.reply({
        embeds: [player_embed],
      });

      return;
    } catch (error) {
      await interaction.reply({ content: error, ephemeral: true });
    }
  };

  const register = async (interaction) => {
    try {
      //get the input data from user
      const [input_data] = interaction.options._hoistedOptions.filter(
        ({ name }) => name === INPUT_NAME
      );

      //just in case its empty
      if (!input_data) throw "Something wen't wrong";

      //get user if it exists
      const user_exists = await User.findOne({
        where: { discord_id: interaction.user.id },
      });

      //if account exists just update the steam_id
      if (user_exists) {
        await user_exists.update({ steam_id: input_data.value });
        await interaction.reply(`Steam ID updated to: ${input_data.value}`);
        return;
      }

      //create account
      const user = await User.create({
        discord_id: interaction.user.id,
        steam_id: input_data.value,
      });

      //send a message after registration
      await interaction.reply(
        `Account registered with STEAM ID to: ${user.get("steam_id")}`
      );
    } catch (error) {
      await interaction.reply({ content: error, ephemeral: true });
    }
  };

  return { profile, register, constants: { USER_OPTION, INPUT_NAME } };
})();
