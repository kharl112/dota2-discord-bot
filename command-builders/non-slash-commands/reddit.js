const Reddit = require("../../helpers/reddit");

const { EmbedBuilder } = require("discord.js");

const fs = require("node:fs");

module.exports = (() => {
  const latest_hot_post = async (message) => {
    //get the acces token from reddit
    const token = await Reddit.get_access_token();

    if(!token) return false;

    //get the latest post
    const post = await Reddit.get_latest_hot_post(token);

    //file path for json
    const REDDIT_LATEST_HOT_POST_FILE_PATH = '/tmp/reddit_latest_hot_post.json';

    const guildId = message.guildId;
    const postId = post.id;

    //check if the json file exists, otherwise create new with empty array
    if(!fs.existsSync(REDDIT_LATEST_HOT_POST_FILE_PATH)) {
      const tmp_file_content = JSON.stringify([], null, 2);
      fs.writeFileSync(REDDIT_LATEST_HOT_POST_FILE_PATH, tmp_file_content, 'utf8');
    }

    //get the json file
    const tmp_file_json = JSON.parse(fs.readFileSync(REDDIT_LATEST_HOT_POST_FILE_PATH)); 

    //get the saved guildId = postId
    const savedData = tmp_file_json.filter((item) => item.guildId == guildId && item.postId == postId);

    //if we can't find the guildId and postId we save it  and send an embed
    if(!savedData.length) {
      //format: Array<{guildId: string, postId: string}>
      //removes all guildId obj to prevent overloading file
      const filtered_json = tmp_file_json.filter((item) => item.guildId != guildId);

      //save the guildId and postId
      filtered_json.push({guildId: guildId, postId: postId});
      fs.writeFileSync(REDDIT_LATEST_HOT_POST_FILE_PATH, JSON.stringify(filtered_json, null, 2), 'utf8');

      //send embed
      const post_embed = new EmbedBuilder()
        .setColor(0x8b8b8b)
        .setTitle(post.title)
        .setURL(post.url)
        .setTimestamp(post.created_utc * 1000);

      if(post.selftext) {
        post_embed.setDescription(post.selftext)
      }

      // get the "updates" channel and send the updates there
      const channels = [...message.guild.channels.cache.values()];
      const textChannels = channels.filter((channel) => channel.type == 0);
      const updateChannels = channels.filter((channel) => channel.name.toLowerCase().includes('updates'));

      if(updateChannels.length) {
        await updateChannels[0].send({ embeds: [post_embed] });
        return true;
      }

      //otherwise send it to the current channel
      await message.channel.send({ embeds: [post_embed]  });
      return true;
    }

    return false;
  }

  return {latest_hot_post}

})();
