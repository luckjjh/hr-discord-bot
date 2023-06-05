module.exports = {
	name:"rerollBtn",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);
        if (!waitingRoom.CheckHostByID(interaction.member.user.id)){
            interaction.reply("Only hosts can interact!");
            return;
        }

        waitingRoom.SetStageRandom();
        waitingRoom.MakeTeam();
        waitingRoom.SendStageWindow();
        interaction.message.delete();
		return;
	},
};