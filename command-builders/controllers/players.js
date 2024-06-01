const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

//helpers
const SEARCH_PLAYER = "search_player";

require('dotenv').config({path: '../../.env' });

const Dota2 = require("../../helpers/dota2");

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
          .setColor(0x8b8b8b)
          .setTitle(player.personaname)
          .setThumbnail(player.avatarfull);
          

        //recent match
        const recent_matches = await axios.get(`${process.env.OPEN_DOTA_URL}/players/${player.account_id}/matches?limit=1&sort=1`);

        if(recent_matches.data[0]){
            const recent_match = recent_matches.data[0];
            const heroes = await Dota2.get_heroes();      

            if(heroes[recent_match.hero_id]){
              const hero = heroes[recent_match.hero_id];
              player_embed.addFields(
                {
                  name: "Last match Info:",
                  value:  `Played as: ${hero.localized_name}`,
                  inline: false,
                },
                {
                  name: "KDA",
                  value:  `${recent_match.kills}/${recent_match.deaths}/${recent_match.assists}`,
                  inline: true,
                },
                {
                  name: "Duration",
                  value:  `${Math.round(recent_match.duration / 60)} minutes`,
                  inline: true,
                },
              ).setFooter({ text: `MATCH ID: ${recent_match.match_id.toString()}`, iconURL: 'https://seeklogo.com/images/D/dota-2-logo-A8CAC9B4C9-seeklogo.com.png' });
            }
        }

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
