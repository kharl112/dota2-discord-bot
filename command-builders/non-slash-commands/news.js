const { EmbedBuilder } = require("discord.js");

require('dotenv').config({path: '../../.env' });

const Dota2 = require("../../helpers/dota2");

const fs = require('node:fs');
const file_path = '/tmp/latest_news_id';

module.exports = (() => {
  const latest_news = async (message) => { 
    try {

      //get the latest news
      const news = await Dota2.get_news();      

      //validations
      if(!news.appnews) {
        console.log(`No results found from: non-slash-commands/latest_news`);
      }

      if(!news.appnews.newsitems.length) {
        console.log(`No results found from: non-slash-commands/latest_news`);
      }

      //get the top from the list
      const news_first = news.appnews.newsitems[0];

      //create file if it does not exitst
      if(!fs.existsSync(file_path)) {
        fs.writeFile(file_path, 'this is a empty file', 'utf8', (error) => {
          if(error) {
            console.error(`Error creating the file: ${file_path}`, err);
            return;
          }
        });
      }


      //get the content 
      const news_id_from_file = fs.readFileSync(file_path, 'utf8');

      //check if the id from the file is outdated
      if(news_id_from_file != news_first['gid']) {

        //overwrite the file
        fs.writeFileSync(file_path, news_first['gid']);

        //send an embed
        const news_embed = new EmbedBuilder()
          .setColor(0x8b8b8b)
          .setTitle(news_first.title)
          .setDescription(news_first.contents)
          .setURL(news_first.url)
          .setTimestamp(news_first.date * 1000);

        await message.reply({ embeds: [news_embed]  });
      }

    }catch(error) {
      console.log(error)
    }
  }

  return {
    latest_news
  };
})();



