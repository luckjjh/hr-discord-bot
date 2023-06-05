const { Events } = require('discord.js');
const { prefix } = require("../config-dev.json");

module.exports ={
    name: Events.MessageCreate,
    async execute(message) {
		if (!message.content.startsWith(prefix)){
            return;
        }
        const removeprefix = message.content.slice(prefix.length);
		const command = message.client.commands.get(removeprefix);
		if (!command) {
			//console.error(`No command matching ${command} was found.`);
			return;
		}
		try {
			await command.execute(message);
		} catch (error) {
			console.error(`Error executing ${command}`);
			console.error(error);
		}
	},
};