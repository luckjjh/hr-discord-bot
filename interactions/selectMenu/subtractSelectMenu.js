module.exports = {
	name:"subtractSelectMenu",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);
        waitingRoom.RemovePlayer(interaction.values[0]);
        waitingRoom.SendHelloWindow();
        interaction.deferUpdate();
		return;
	},
};