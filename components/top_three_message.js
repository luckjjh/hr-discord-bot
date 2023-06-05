const{
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    topThreeMessage(topThreeData) {
        const dataEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Top 3👑")
        .addFields(
          {
            name: "🥇 1️⃣등",
            value: `${topThreeData[0]["NAME"]} ${topThreeData[0]["POWER"]} 롤투력`,
          },
          {
            name: "🥈 2️⃣등 🫘",
            value: `${topThreeData[1]["NAME"]} ${topThreeData[1]["POWER"]} 롤투력`,
          },
          {
            name: "🥉 3️⃣등",
            value: `${topThreeData[2]["NAME"]} ${topThreeData[2]["POWER"]} 롤투력`,
          }
        );
        return { embeds: [dataEmbed] };
    }
}