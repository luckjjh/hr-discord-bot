const {civilWarWindow} = require("../../components/gameIntroWindow.js");
module.exports = {
	name:"startBtn",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);

		if (!waitingRoom.CheckHostByID(interaction.member.user.id)){
            interaction.reply("Only hosts can interact!");
            return;
        }
		
		waitingRoom.MoveEachTeamToVoiceChannel();
		waitingRoom.SendOpeningWindow();
		interaction.message.delete();
		return;
	},
};