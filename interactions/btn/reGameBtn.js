module.exports = {
	name:"reGameBtn",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);

		if (!waitingRoom.CheckHostByID(interaction.member.user.id)){
            interaction.reply("Only hosts can interact!");
            return;
        }

        waitingRoom.MakeTeam();
        waitingRoom.SendStageWindow();
		interaction.message.delete();
		return;
	},
};