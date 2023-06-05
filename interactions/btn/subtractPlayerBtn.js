const {subtractSelectMenu} = require("../../components/subtractSelectMenu.js");

module.exports = {
	name:"subtractPlayerBtn",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);

        if (!waitingRoom.CheckHostByID(interaction.member.user.id)){
            interaction.reply("Only hosts can interact!");
            return;
        }
		const select=subtractSelectMenu(waitingRoom);
		interaction.reply(select);
		return;
	},
};