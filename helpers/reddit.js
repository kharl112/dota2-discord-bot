const axios = require('axios');
require('dotenv').config({ path: '../.env' });


module.exports = (() => {
  const USERAGENT =  'dota2-discord-bot';
  const get_access_token = async () => {
    try {

      const response = await axios.post(
        'https://www.reddit.com/api/v1/access_token',
        new URLSearchParams({
          grant_type: 'password',
          username: process.env.REDDIT_USERNAME,
          password: process.env.REDDIT_PASSWORD
        }),
        {
          auth: {
            username: process.env.REDDIT_CLIENT_ID,
            password: process.env.REDDIT_CLIENT_SECRET 
          },
          headers: {
            'User-Agent': USERAGENT,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data.access_token
    }catch(error) {
      console.log(error);
      return null;
    }
  }  

  const get_latest_hot_post = async (token, subreddit = 'DotA2') => {
    try {
      const response = await axios.get(`https://oauth.reddit.com/r/${subreddit}/hot`, {
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': USERAGENT },
        params: { limit: 1 }
      });

      return response.data.data.children[0].data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  return { get_access_token, get_latest_hot_post };
})();






