const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

//helpers
const SEARCH_ITEM = "search_item";

require('dotenv').config({path: '../../.env' });

const Dota2 = require("../../helpers/dota2");

module.exports = (() => {
  const search_item = async (interaction) => {
      const [ search_input ] = interaction.options._hoistedOptions.filter(
          ({ name }) => name === SEARCH_ITEM
      );

      try {

        //no search inputs
        if(!search_input) throw 'No results found';
        if(!search_input.value) throw 'No results found';
      
        //prevent getting unknown interaction error
        await interaction.deferReply();

        const items = await Dota2.get_items();      
        if(!items) throw 'This command is not available at the moment.';

        const item = items.filter((item) => {
          if(!item.dname) return false;
          if(item.dname.toLowerCase().includes('recipe')) return false;
          return item.dname.toLowerCase().includes(search_input.value.toLowerCase());
        });

        
        if(!item[0]) throw 'No results found.';

        const _item = item[0];
        const item_embed = new EmbedBuilder()
          .setColor(0x8b8b8b)
          .setTitle(_item.dname)
          .setDescription(_item.notes ? _item.notes : _item.lore)
          .setThumbnail(`https://cdn.cloudflare.steamstatic.com/${_item.img}`)
          .addFields(
                {
                  name: "Cost",
                  value:  _item.cost ? _item.cost.toString() + ' gold' : 'Not Available',
                  inline: true,
                },
          );

        
        //theres no cd on some items
        if(_item.cd){
          item_embed.addFields(
            {
              name: "Cooldown",
              value:  _item.cd + 's',
              inline: true,
            }
          );
        }


        //ability spec [ Obj<key, value> ]
        _item.attrib.forEach((spec) => {
          item_embed.addFields(
            {
              name: spec.key.replaceAll('_', ' '),
              value:  spec.display ? spec.display.replace("{value}",spec.value) : spec.value,
              inline: true,
            },
          );
        });


        await interaction.editReply({ embeds: [item_embed] });
      }catch(error){
        console.log(error)
        await interaction.editReply({ content: error.toString(), ephemeral: true });
      }
  };


  return {
    search_item,
    constants: { SEARCH_ITEM },
  };
})();
