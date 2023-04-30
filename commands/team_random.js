const {teamWindow} = require("../components/team_window.js");
const Stage = require("../classes/stage.js");
const { Team } = require("discord.js");
IsAuthorInVoiceChannel= function(message){
  if (message.member.voice.channel){
    return 1;
  }else{
    return 0;
  }
};

IsEvenMemberInChannel= function(channel){
  if (channel.members.size % 2) {
    return 0;
  }else{
    return 1;
  }
};


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

MakeStage = function(message, mainChannel){
  let stage = new Stage(message.member,mainChannel,mainChannel.members);
  return stage;
}

module.exports = {
	name:"team",
	async execute(message) {
    if (!IsAuthorInVoiceChannel(message)){
      message.reply("음성 채널에 입장한 뒤 사용해주세요!");
      return;
    }

    const main_channel = await message.guild.channels.fetch(
      message.member.voice.channel.id
    );
    if (!IsEvenMemberInChannel(main_channel)){
      message.reply("현재 채널의 인원이 홀수입니다. 짝수 인원으로 맞춰주세요!");
      return;
    }
    
    const sub_channel = FindEmptyVoiceChannel(message);
    if (sub_channel==null){
      message.reply("여분의 빈 음성 채널이 필요해요!");
      return;
    }
    let stage = MakeStage(message,main_channel);
    stage.makeTeamRandom();
    //console.log(stage);
    const teamAName = stage.getTeamAName();
    const teamBName = stage.getTeamBName();
    console.log(teamAName);
    console.log(teamBName);
    message.channel.send(teamWindow(teamAName,teamBName,2384,7542));
    return;
	},
};