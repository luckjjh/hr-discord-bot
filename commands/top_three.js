const DB = require("../db_api.js");
const {topThreeMessage} = require("../components/top_three_message");

module.exports = {
	name:"top3",
	async execute(message) {
        const topThreeData= await DB.getTop3(message.guildId,true);
        const content = topThreeMessage(topThreeData);
        message.channel.send(content);
	},
};