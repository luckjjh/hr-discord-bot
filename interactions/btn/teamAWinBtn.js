module.exports = {
	name:"teamAWinBtn",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);

        if (!waitingRoom.CheckHostByID(interaction.member.user.id)){
            interaction.reply("Only hosts can interact!");
            return;
        }
        
        waitingRoom.MoveAllToVoiceChannel();
        waitingRoom.ReflectResult("A");
        waitingRoom.UpdateDB();
        interaction.message.delete();
        waitingRoom.SendClosingWindow();
		return;
	},
};