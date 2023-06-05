const {chooseLeaderWindow} = require("../../components/chooseLeaderWindow");
module.exports = {
	name:"selectDraftTeamAMemberMenu",
	async execute(interaction) {
		const client=interaction.client;
        const waitingRoom=client.waitingRooms.get(interaction.guildId);
        if (!waitingRoom.CheckTeamALeaderByID(interaction.member.user.id)){
            interaction.reply("Only Team 1 Leader can interact!");
            return;
        }
        waitingRoom.AddPlayerToTeamA(interaction.values[0]);
        const count = waitingRoom.teamA.length + waitingRoom.teamB.length;
        interaction.reply(chooseLeaderWindow(count,waitingRoom));
        interaction.message.delete();
		return;
	},
};