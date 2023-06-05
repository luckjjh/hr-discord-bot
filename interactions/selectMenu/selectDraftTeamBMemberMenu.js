const {chooseLeaderWindow} = require("../../components/chooseLeaderWindow");
module.exports = {
	name:"selectDraftTeamBMemberMenu",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);
        if (!waitingRoom.CheckTeamBLeaderByID(interaction.member.user.id)){
            interaction.reply("Only Team 2 Leader can interact!");
            return;
        }
        waitingRoom.AddPlayerToTeamB(interaction.values[0]);
        const count = waitingRoom.teamA.length + waitingRoom.teamB.length;
        interaction.reply(chooseLeaderWindow(count,waitingRoom));
        interaction.message.delete();
		return;
	},
};