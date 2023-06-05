module.exports = {
	name:"randomBtn",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);

		if (!waitingRoom.CheckHostByID(interaction.member.user.id)){
            interaction.reply("Only hosts can interact!");
            return;
        }

		if (!waitingRoom.CheckPlayersEven()){
			interaction.reply("Players are not even!");
            return;
		}

		waitingRoom.SetStageRandom();
        waitingRoom.MakeTeam();
		waitingRoom.SetTeamInfo();
        waitingRoom.SendStageWindow();
		interaction.message.delete();
		return;
	},
};