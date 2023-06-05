const COMMAND = require("../command.js");

module.exports = {
	name:"dice",
	async execute(interaction) {
		await interaction.reply(
            `🎲${
              interaction.author.username
            }님의 주사위: ${COMMAND.rollDice().toString()}🎲`
        );
	},
};