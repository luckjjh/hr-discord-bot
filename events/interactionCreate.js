const { Events } = require('discord.js');
const { prefix } = require("../config-dev.json");

module.exports ={
    name: Events.InteractionCreate,
    async execute(interaction) {
        let command= null;
		if (interaction.isButton()){
            command = interaction.client.btnInteractions.get(interaction.customId);
        }else if (interaction.isStringSelectMenu()){
            command = interaction.client.smInteractions.get(interaction.customId);
        }

        if (!command){
            return;
        }
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${command}`);
            console.error(error);
        }
	},
};