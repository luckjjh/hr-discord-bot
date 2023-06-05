const{
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

module.exports = {
    DraftStageWindow(teamAName, teamBName, teamAPower, teamBPower) {
        const teamEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("팀 구성 결과🚀")
        .setURL("https://youtu.be/k6FmEwkD6SQ")
        .addFields(
          { name: "1️⃣팀", value: teamAName, inline: true },
          { name: "Total LP", value: `${teamAPower}`, inline: true },
          { name: "\u200b", value: "\u200b" },
          { name: "2️⃣팀", value: teamBName, inline: true },
          { name: "Total LP", value: `${teamBPower}`, inline: true }
        );

        let teamBtnRow = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("startBtn")
              .setLabel("🏃‍♂️Start🏃‍♂️")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("stopBtn")
              .setLabel("Stop")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId("backBtn")
              .setLabel("Back")
              .setStyle(ButtonStyle.Secondary),
          );
        return { embeds: [teamEmbed], components: [teamBtnRow] };
    }
}