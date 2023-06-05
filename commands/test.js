const WaitingRoom = require("../classes/waitingRoom.js");

IsAuthorInVoiceChannel= function(message){
    if (message.member.voice.channel){
        return 1;
    }else{
        return 0;
    }
};

FindMainVoiceChannel = async function(interaction){
    const mainVoiceChannel = await interaction.guild.channels.fetch(
        interaction.member.voice.channel.id
    );
    return mainVoiceChannel;
}

FindEmptyVoiceChannel = function (interaction) {
    const channels= interaction.guild.channels.cache;
    const nChannel= channels.size;
    const voice_type =2;
    for (let i=0;i<nChannel;i++){
        const channel=channels.at(i);
        if (channel.type!=voice_type) continue;
        if (channel.id == interaction.guild.afkChannelId) continue;
        if (channel.members.size == 0 ){
        return channel;
        }
    }
    return null;
};

IsExistWaitingRoom = function(message){
    const client = message.client;
    const waitingRoom = client.waitingRooms.get(message.guildId);
    return waitingRoom;
}

module.exports = {
	name:"test",
	async execute(message) {
    if (!IsAuthorInVoiceChannel(message)){
      message.reply("This command is available after entering the voice channel!");
      return;
    }

    if (IsExistWaitingRoom(message)){
      message.reply("There is already an active waiting room!");
      return;
    }

    const main_channel = await FindMainVoiceChannel(message);
    
    const sub_channel = FindEmptyVoiceChannel(message);
    if (sub_channel==null){
      message.reply("여분의 빈 음성 채널이 필요해요!");
      return;
    }
    let waitingRoom = new WaitingRoom(message.guildId,message.member,main_channel,sub_channel,message.channel,main_channel.members);
    const client = message.client;
    client.waitingRooms.set(waitingRoom.guildId, waitingRoom);
    waitingRoom.SynchronizeWithDB();
    waitingRoom.SendHelloWindow();
    return;
	},
};
//team은 waiting에 유지
//만드는 방식만 바꾸기
//stage->makeTeam