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

  return { get_heroes };
})();
