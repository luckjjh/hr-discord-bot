module.exports = {
	name:"backBtn",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);

		if (!waitingRoom.CheckHostByID(interaction.member.user.id)){
            interaction.reply("Only hosts can interact!");
            return;
        }

        waitingRoom.SendHelloWindow();
		interaction.message.delete();
		return;
	},
};