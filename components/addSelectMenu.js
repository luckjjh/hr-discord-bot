const{
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
    addSelectMenu(waitingRoom) {
        const selectMenu = new StringSelectMenuBuilder()
			.setCustomId('addSelectMenu')
			.setPlaceholder('Make a selection!');
        const targetChannel=waitingRoom.mainVoiceChannel;
		const memberSize=targetChannel.members.size;
		for (let i=0;i<memberSize;i++){
            if (waitingRoom.players.get(targetChannel.members.at(i).user.id)){
                continue;
            }
			selectMenu.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel(targetChannel.members.at(i).displayName)
					.setValue(targetChannel.members.at(i).id),
			)
		}

        const row = new ActionRowBuilder()
			.addComponents(selectMenu);
        return {content: "Please select the player to add to the game.", components: [row], ephemeral: true};
    }
}