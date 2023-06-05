const{
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    lowThreeMessage(lowThreeData) {
        const dataEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Low 3👑")
        .addFields(
          {
            name: "🥇 뒤에서 1️⃣등",
            value: `${lowThreeData[0]["NAME"]} ${lowThreeData[0]["POWER"]} 롤투력`,
          },
          {
            name: "🥈 뒤에서 2️⃣등 🫘",
            value: `${lowThreeData[1]["NAME"]} ${lowThreeData[1]["POWER"]} 롤투력`,
          },
          {
            name: "🥉 뒤에서 3️⃣등",
            value: `${lowThreeData[2]["NAME"]} ${lowThreeData[2]["POWER"]} 롤투력`,
          }
        );
        return { embeds: [dataEmbed] };
    }
}