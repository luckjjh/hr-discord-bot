module.exports = {
	name:"info",
	async execute(message) {
		const client = message.client;
        const waitingRoom = client.waitingRooms.get(message.guildId);
        if (!waitingRoom){
            message.reply("There are currently no active waiting rooms!");
        }else{
            waitingRoom.SendHelloWindow();
        }
        return;
	},
};