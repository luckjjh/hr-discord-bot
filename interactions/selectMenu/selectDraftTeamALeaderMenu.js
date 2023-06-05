const {chooseLeaderWindow} = require("../../components/chooseLeaderWindow");
module.exports = {
	name:"selectDraftTeamALeaderMenu",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);
        if (!waitingRoom.CheckHostByID(interaction.member.user.id)){
            interaction.reply("Only hosts can interact!");
            return;
        }
        waitingRoom.AddPlayerToTeamA(interaction.values[0]);
        interaction.reply(chooseLeaderWindow(1,waitingRoom));
        interaction.message.delete();
		return;
	},
};