const Sequelize = require("sequelize");
const instance = require("../instance");

const User = instance.define("users", {
  discord_id: {
    type: Sequelize.STRING,
    unique: true,
  },
  steam_id: {
    type: Sequelize.STRING,
    unique: true,
  },
});

module.exports = User;
