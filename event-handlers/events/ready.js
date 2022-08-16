const User = require("../../database/models/user");

module.exports = {
  name: "ready",
  //identifies if execute function will execute once
  once: true,
  execute(client) {
    //define table users
    User.sync();
    console.log(`${client.user.tag} has arise from death`);
  },
};
