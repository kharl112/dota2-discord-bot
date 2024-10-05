const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

require('dotenv').config({path: '../../.env' });

const Dota2 = require("../../helpers/dota2");

module.exports = (() => {
  const latest_news = async (interaction) => { 
    try {

      //prevent getting unknown interaction error
      await interaction.deferReply();

      const news = await Dota2.get_news();      

      if(!news.appnews) {
        await interaction.editReply({ content: "Error occured", ephemeral: true });
      }

      if(!news.appnews.newsitems.length) {
        await interaction.editReply({ content: "No updates found.", ephemeral: true });
      }

      const news_first = news.appnews.newsitems[0];

      const news_embed = new EmbedBuilder()
        .setColor(0x8b8b8b)
        .setTitle(news_first.title)
        .setDescription(news_first.contents)
        .setURL(news_first.url)
        .setTimestamp(news_first.date * 1000);

      await interaction.editReply({ embeds: [news_embed]  });
    }catch(error) {
      console.log(error)
      await interaction.editReply({ content: error.toString(), ephemeral: true });
    }

  }

  return {
    latest_news,
    constants: {}
  };

})();



