const {chooseLeaderWindow} = require("../../components/chooseLeaderWindow");
module.exports = {
	name:"selectDraftTeamBLeaderMenu",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);
        if (!waitingRoom.CheckHostByID(interaction.member.user.id)){
            interaction.reply("Only hosts can interact!");
            return;
        }
        waitingRoom.AddPlayerToTeamB(interaction.values[0]);
        interaction.reply(chooseLeaderWindow(2,waitingRoom));
        interaction.message.delete();
		return;
	},
};