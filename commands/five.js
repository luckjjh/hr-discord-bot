module.exports = {
	name:"5",
	async execute(message) {
		const reply = await message.reply("@everyone 롤 5인 하실 분~");
      	reply.react("🙋‍♂️");
      	reply.react("🙅‍♂️");
	},
};