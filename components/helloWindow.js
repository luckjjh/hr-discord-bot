const{
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

module.exports = {
    helloWindow(waitingRoom) {
        const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Hello~🙋‍♂️")
        .addFields(
            { name: "Host", value: waitingRoom.host.displayName},
            { name: "Voice 1", value: waitingRoom.mainVoiceChannel.name},
            { name: "Voice 2", value: waitingRoom.subVoiceChannel.name},
            { name: "Players", value: waitingRoom.GetPlayerNames()},
        );
        
        let btnRow = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("randomBtn")
              .setLabel("Random")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("draftBtn")
              .setLabel("Draft")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("addPlayerBtn")
              .setLabel("player➕")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("subtractPlayerBtn")
              .setLabel("player➖")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("stopBtn")
              .setLabel("Stop")
              .setStyle(ButtonStyle.Danger),
        );

        return { embeds: [embed], components: [btnRow]};
    }
}