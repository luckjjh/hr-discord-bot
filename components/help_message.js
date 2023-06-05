const{
    EmbedBuilder,
    AttachmentBuilder,
} = require("discord.js");

const path = require('node:path');

module.exports = {
    helpMessage() {
        const assetsPath = path.join(__dirname, '../assets');
        const assetPath = path.join(assetsPath, "icon.png");
        const iconImage = new AttachmentBuilder(assetPath);
        const helpEmbed = new EmbedBuilder()
          .setImage("https://images.app.goo.gl/CPgEwFff2o6DdLa87")
          .setColor("#10B4D1")
          .setTitle("👋안녕하세요! 🤖HR Office bot 입니다.")
          .setDescription(
            "저는 음성채널의 사람들을 무작위 팀으로 나누어 주는 봇입니다. 또한, DB에 저장된 데이터를 기반으로 개개인의 승률, 롤투력 등.. 다양한 정보를 제공합니다.\n\n\
          🎉 아래 명령어들을 사용해 보세요."
          )
          .addFields({
            name: "!help",
            value: "명령어 목록을 불러옵니다.",
          })
          .addFields({
            name: "!5vs5",
            value: "채널에 속해있는 모두에게 푸시 알림을 보냅니다.",
          })
          .addFields({
            name: "!dice",
            value: "1~99 범위를 갖는 주사위를 굴립니다.",
          })
          .addFields({
            name: "!team",
            value: "현재 접속해 있는 음성채널의 인원들로 팀을 구성합니다.",
          })
          .addFields({
            name: "!top3",
            value: "롤투력 상위 3인을 표시합니다.",
          })
          .addFields({
            name: "!showAll",
            value: "DB에 저장된 모든 인원을 표시합니다.",
          })
          .addFields({
            name: "!show {name}",
            value: "name에 해당하는 인원을 표시합니다.",
          })
          .setFooter({ text: "🖥️Developed by. Junghyeon Jung, skfsjrnfl" });
        return { embeds: [helpEmbed], files: [iconImage] };
    }
}