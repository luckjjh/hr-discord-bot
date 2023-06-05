const { Events } = require('discord.js');

module.exports = {
	name: Events.Error,
	once: true,
	execute(err) {
		console.log(err.message);
	},
};