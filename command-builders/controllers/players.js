const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

//helpers
const Status = require("../../helpers/account_status");
const SEARCH_PLAYER = "search_player";

require('dotenv').config({path: '../../.env' });

module.exports = (() => {
  const search_player = async (interaction) => {
      const [ search_input ] = interaction.options._hoistedOptions.filter(
          ({ name }) => name === SEARCH_PLAYER
      );

      if(!search_input){
        await interaction.reply({ content: 'No results found.', ephemeral: true });
        return false;
      }  

      await interaction.reply(search_input.value);
      return true;
  };


  return {
    search_player,
    constants: { SEARCH_PLAYER },
  };
})();
