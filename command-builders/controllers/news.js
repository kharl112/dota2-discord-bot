const { EmbedBuilder } = require("discord.js");

require('dotenv').config({path: '../../.env' });

const Dota2 = require("../../helpers/dota2");
const Reddit = require("../../helpers/reddit");

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

  const latest_bugs = async (interaction) => { 
    try {

      //prevent getting unknown interaction error
      await interaction.deferReply();

      const token = await Reddit.get_access_token();

      const bugs = await Reddit.get_latest_bugs(token);      

      if(!bugs.length) {
        await interaction.editReply({ content: "No updates found.", ephemeral: true });
      }

      //limit to 5 
      bugs.splice(5);

      const content = bugs.reduce((init, { data }) => {
        const title = `- **[${data.title}](${data.url})** [${new Date(data.created_utc * 1000).toDateString()}]`; 

        let description = data.selftext.replaceAll('\n', '').replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        if(description.length > 100) {
          description = description.slice(0,100).concat('...');
        }

        return `${init} \n ${title} \n ${description} \n ` 
      }, '');

      await interaction.editReply({ content, embeds: []  });
    }catch(error) {
      console.log(error)
      await interaction.editReply({ content: error.toString(), ephemeral: true });
    }

  }

  return {
    latest_news,
    latest_bugs,
    constants: {}
  };

})();



