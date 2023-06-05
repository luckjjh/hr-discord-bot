const{
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

module.exports = {
    gameIntroWindow(teamAName,teamBName,teamAPower,teamBPower,highestScore, highestStreak, teamAWinningRate, teamBWinningRate) {
        const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("내전을 시작~ 하겠습니다~~🥊")
        .addFields(
            { name: "Team 1️⃣", value: teamAName, inline: true },
            { name: "Total LP", value: `${teamAPower}`, inline: true },
            { name: "Winning Rate", value: `${teamAWinningRate.toFixed(2)}`, inline: true },
            { name: "\u200b", value: "\u200b" },
            { name: "Team 2️⃣", value: teamBName, inline: true },
            { name: "Total LP", value: `${teamBPower}`, inline: true },
            { name: "Winning Rate", value: `${teamBWinningRate.toFixed(2)}`, inline: true },
            { name: "\u200b", value: "\u200b" },
            { name: "👑The highest score👑", value: highestScore, },
            { name: "\u200b", value: "\u200b" },
            { name: "💎The highest winning streak💎", value: highestStreak, },
        );
        let btnRow = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("teamAWinBtn")
              .setLabel("1️⃣팀 승리")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("teamBWinBtn")
              .setLabel("2️⃣팀 승리")
              .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
              .setCustomId("stopBtn")
              .setLabel("Stop")
              .setStyle(ButtonStyle.Danger)
        );
        return { embeds: [embed], components: [btnRow], files: [{ attachment: "./assets/opening.gif" }] };
    }
}