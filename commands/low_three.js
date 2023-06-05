const DB = require("../db_api.js");
const {lowThreeMessage} = require("../components/low_three_message.js");

module.exports = {
	name:"low3",
	async execute(message) {
                const lowThreeData= await DB.getTop3(message.guildId,false);
                const content = lowThreeMessage(lowThreeData);
                message.channel.send(content);
	},
};