const{
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
    subtractSelectMenu(waitingRoom) {
        const selectMenu = new StringSelectMenuBuilder()
			.setCustomId('subtractSelectMenu')
			.setPlaceholder('Make a selection!');

		const memberSize=waitingRoom.players.size;
		for (let i=0;i<memberSize;i++){
			selectMenu.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel(waitingRoom.players.at(i).displayName)
					.setValue(waitingRoom.players.at(i).id),
			)
		}

        const row = new ActionRowBuilder()
			.addComponents(selectMenu);
        return {content: "Please select the player to exclude from the game.", components: [row], ephemeral: true};
    }
}