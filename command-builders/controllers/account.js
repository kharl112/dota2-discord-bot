const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
const Dota2Api = require("dota2-api");

const dota2 = Dota2Api.create(process.env.STEAM_API_KEY);

//helpers
const Status = require("../../helpers/account_status");

//models
const User = require("../../database/models/user");

//constants
const INPUT_NAME = "steam_id";
const USER_OPTION = "member";
const SEARCH_LIVE = "search_live";

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

  const live = async (interaction) => {
    try {
      //get the input data from user
      const [input_data] = interaction.options._hoistedOptions.filter(
        ({ name }) => name === SEARCH_LIVE
      );

      //just in case its empty
      if (!input_data) throw "Something wen't wrong";

      const { result } = await dota2.getLiveLeagueGames();
      if (!result) throw "No team found";
      if (!result.games.length) throw "No live games found";

      const [live_game_found] = result.games.filter(
        ({ radiant_team, dire_team }) =>
          radiant_team?.team_name
            .toLowerCase()
            .includes(input_data.value.toLowerCase()) ||
          dire_team?.team_name
            .toLowerCase()
            .includes(input_data.value.toLowerCase())
      );

      if (!live_game_found) throw "No live games found";

      console.log(live_game_found);

      const default_fields = [
        {
          name: "TEAM",
          value:
            live_game_found.radiant_team.team_name.toString() +
            "\n  " +
            live_game_found.dire_team.team_name.toString(),
          inline: true,
        },
        {
          name: "STANDING",
          value:
            live_game_found.radiant_series_wins.toString() +
            "\n  " +
            live_game_found.dire_series_wins.toString(),
          inline: true,
        },
        {
          name: "KILLS",
          value:
            live_game_found.scoreboard.radiant.score.toString() +
            "\n  " +
            live_game_found.scoreboard.dire.score.toString(),
          inline: true,
        },
      ];

      const live_game_embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Live Now")
        .setDescription(
          "Spectators: " +
            live_game_found.spectators.toString() +
            "\n" +
            "Game: " +
            (live_game_found.series_type + 1).toString()
        )
        .setThumbnail(
          "https://cdn.vox-cdn.com/thumbor/7pam8M9JfbGWAYouPND0d2vCZtY=/0x0:660x360/1200x0/filters:focal(0x0:660x360):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/6645195/dota-2-logo.0.jpg"
        );

      if (live_game_found.scoreboard) {
        const { scoreboard } = live_game_found;
        live_game_embed.setFooter({
          text: `Time elapsed: ${parseInt(scoreboard.duration)}`,
        });
      }

      live_game_embed.addFields(...default_fields);

      await interaction.reply({ embeds: [live_game_embed] });
    } catch (error) {
      console.log(error);
      await interaction.reply({ content: error.toString(), ephemeral: true });
    }
  };

  return {
    profile,
    register,
    live,
    constants: { USER_OPTION, INPUT_NAME, SEARCH_LIVE },
  };
})();
