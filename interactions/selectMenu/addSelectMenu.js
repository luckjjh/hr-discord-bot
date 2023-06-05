module.exports = {
	name:"addSelectMenu",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);
        waitingRoom.AddPlayer(interaction.values[0]);
        waitingRoom.SendHelloWindow();
        interaction.deferUpdate();
		return;
	},
};