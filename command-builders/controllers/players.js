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

      try {

        //no search inputs
        if(!search_input) throw 'No results found';
        if(!search_input.value) throw 'No results found';
      
        //prevent getting unknown interaction error
        await interaction.deferReply();

        //get player basic info 
        const request = await axios.get(`${process.env.OPEN_DOTA_URL}/search?q=${search_input.value}`);
        if (!request.data[0]) throw 'No results found';

        //get player full info
        const player = request.data[0];

        const player_embed = new EmbedBuilder()
          .setColor(0x1ccc17)
          .setTitle(player.personaname)
          .setThumbnail(player.avatarfull)
          .addFields(
            {
              name: "Last Match",
              value:  new Date(player.last_match_time).toLocaleString("en-us", { dateStyle: "medium" }),
              inline: true,
            }
          );

        await interaction.editReply({ embeds: [player_embed] });
      }catch(error){
        console.log(error)
        await interaction.editReply({ content: error.toString(), ephemeral: true });
      }
  };


  return {
    search_player,
    constants: { SEARCH_PLAYER },
  };
})();
