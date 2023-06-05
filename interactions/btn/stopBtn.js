module.exports = {
	name:"stopBtn",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);

        if (!waitingRoom.CheckHostByID(interaction.member.user.id)){
            interaction.reply("Only hosts can interact!");
            return;
        }
        
        client.waitingRooms.delete(interaction.guildId);
        interaction.reply("Game is over...");
        interaction.message.delete();
		return;
	},
};