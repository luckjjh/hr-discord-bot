const{
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

module.exports = {
    gameClosingWindow() {
        const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Closing")
        .addFields(
            { name: "GG", value: "Good Game", },
        );
        let btnRow = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("reGameBtn")
              .setLabel("One more?")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("stopBtn")
              .setLabel("Stop")
              .setStyle(ButtonStyle.Danger),
        );
        return { embeds: [embed], components: [btnRow]};
    }
}