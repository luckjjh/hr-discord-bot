module.exports = {
	name:"5vs5",
	async execute(message) {
		await message.reply("@everyone 롤 내전 하실 분~").then(
			sentMessage=>{
				sentMessage.react("🙋‍♂️");
				sentMessage.react("🙅‍♂️");
			}
		);
	},
};