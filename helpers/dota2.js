const NodeCache = require("node-cache");
const dotaCache = new NodeCache();

const axios = require("axios");
require('dotenv').config({path: '../.env'});

module.exports = (() => {

  const get_heroes = async() => {
    try {
     const key = 'all_heroes';
     if(dotaCache.get(key)) return dotaCache.get(key);

     const request = await axios.get(`${process.env.OPEN_DOTA_URL}/constants/heroes`);
     if (!request.data) throw 'No results found';

     dotaCache.set(key, request.data, 60000);

     return request.data;
    }catch(error) {
      console.log(error)
      return null;
    }
  };

  const get_items = async() => {
    try {
      const key = 'all_items';
      if(dotaCache.get(key)) return dotaCache.get(key);

      const request = await axios.get(`${process.env.OPEN_DOTA_URL2}/items.json`);
      if (!request.data) throw 'No results found';

      const data = Object.values(request.data);
      dotaCache.set(key, data, 60000);

      return data;
    }catch(error) {
      console.log(error)
      return null;
    }
  };

  const get_news = async() => {
    try {
      const request = await axios.get(`${process.env.STEAM_NEWS_DOTA}/&count=1&maxlength=300&format=json`);

      return request.data;
    }catch(error) {
      console.log(error)
      return null;
    }
  }



  return { get_heroes, get_items, get_news };
})();
