const {addSelectMenu} = require("../../components/addSelectMenu.js");

module.exports = {
	name:"addPlayerBtn",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);

        if (!waitingRoom.CheckHostByID(interaction.member.user.id)){
            interaction.reply("Only hosts can interact!");
            return;
        }
		const select=addSelectMenu(waitingRoom);
		interaction.reply(select);
		return;
	},
};