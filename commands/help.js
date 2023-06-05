const {helpMessage} = require("../components/help_message");

module.exports = {
	name:"help",
	async execute(message) {
        const content = helpMessage();
        message.channel.send(content);
	},
};