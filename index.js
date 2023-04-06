//Requirements
const {
  Client,
  Events,
  GatewayIntentBits,
  GuildMemberManager,
  GuildMember,
  Guild,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
} = require("discord.js");
const DB = require("./db_api.js");
const COMMAND = require("./command.js");
const { token } = require("./config-dev.json"); //commit 시 수정
const { helpPhrase } = require("./assets/helpPhrase.js");
const nodeHtmlToImage = require("node-html-to-image");

let checkDelay = false;
let teamAName = [];
let teamBName = [];
let teamAID = [];
let teamBID = [];
let waitingCh;
let btnRow = new ActionRowBuilder().setComponents(
  new ButtonBuilder()
    .setCustomId("team1winBtn")
    .setLabel("1️⃣팀 승리")
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId("team2winBtn")
    .setLabel("2️⃣팀 승리")
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId("rerollBtn")
    .setLabel("🎲리롤🎲")
    .setStyle(ButtonStyle.Danger),
  new ButtonBuilder()
    .setCustomId("startBtn")
    .setLabel("🏃‍♂️시작🏃‍♂️")
    .setStyle(ButtonStyle.Success)
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel],
});

TeamWindow = function (channel) {
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("팀 구성 결과🚀")
    .setURL("https://youtu.be/k6FmEwkD6SQ")
    .addFields(
      { name: "1️⃣팀", value: teamAName.join(", ") },
      { name: "2️⃣팀", value: teamBName.join(", ") }
    );
  setTimeout(() => {
    checkDelay = true;
  }, 60000);
  channel.send({ embeds: [exampleEmbed], components: [btnRow] });
};

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("messageCreate", async (message) => {
  if (message.author.username === "kwonSM") {
    message.react("💩");
  }
  switch (message.content) {
    case "!5vs5":
      message.reply("@everyone");
      break;
    case "!ping":
      message.reply("pong");
      break;
    case "!dice":
      message.reply(
        `🎲${
          message.author.username
        }님의 주사위: ${COMMAND.rollDice().toString()}🎲`
      );
      break;
    case "!team":
      if (message.member.voice.channel == null) {
        message.reply("음성 채널에 입장한 뒤 호출해주세요!");
        break;
      }
      waitingCh = message.member.voice.channel;
      teamdata = await COMMAND.makeTeam(message);
      if (teamdata != null) {
        [teamAName, teamBName, teamAID, teamBID] = teamdata;
        TeamWindow(message.channel);
      } else {
        message.channel.send(
          "현재 채널 접속 인원이 홀수입니다. 짝수 인원으로 맞춰주세요!"
        );
      }

      break;
  }

  if (message.content == "!help") {
    const help = await nodeHtmlToImage({
      html: helpPhrase,
      quality: 50,
      type: "png",
      puppeteerArgs: {
        args: ["--no-sandbox"],
      },
      encoding: "buffer",
    });
    const helpImage = new AttachmentBuilder(help);
    message.channel.send({ files: [helpImage] });
  }
  if (message.content == "!top3") {
    const top3Data = await DB.getTop3(true);
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Top 3👑")
      .addFields(
        {
          name: "1️⃣등",
          value: `${top3Data[0].name.title[0].text.content} ${top3Data[0].power.number} 롤투력`,
        },
        {
          name: "2️⃣등",
          value: `${top3Data[1].name.title[0].text.content} ${top3Data[1].power.number} 롤투력`,
        },
        {
          name: "3️⃣등",
          value: `${top3Data[2].name.title[0].text.content} ${top3Data[2].power.number} 롤투력`,
        }
      );
    message.reply({ embeds: [exampleEmbed] });
  }
  if (message.content == "!register") {
    await COMMAND.registerUser(message);
    message.reply("등록까지 1~2분 소요됩니다.");
  }
  if (message.content == "!showAll") {
    const userData = await DB.getAllUserData();
    let allData = [];
    userData.forEach((item) => {
      const percent =
        (item.properties.win.number /
          (item.properties.lose.number + item.properties.win.number)) *
        100;
      allData.push({
        name: `이름: ${item.properties.name.title[0].text.content}`,
        value: `승: ${item.properties.win.number} 
          패: ${item.properties.lose.number} 
          파워: ${item.properties.power.number} 
          승률: ${percent}`,
      });
    });
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("All user")
      .addFields(allData);
    message.reply({ embeds: [exampleEmbed] });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.component.data.custom_id === "rerollBtn") {
      interaction.reply(
        `**${interaction.user.username}**님이 '리롤 버튼'을 클릭했습니다.`
      );
      if (interaction.member.voice.channel !== waitingCh) {
        interaction.channel.send("내전 대기자만 누를 수 있습니다!");
      } else {
        teamdata = await COMMAND.makeTeam(interaction);
        if (teamdata != null) {
          await interaction.message.delete();
          [teamAName, teamBName, teamAID, teamBID] = teamdata;
          await TeamWindow(interaction.channel);
        } else {
          interaction.channel.send(
            "현재 채널 접속 인원이 홀수입니다. 짝수 인원으로 맞춰주세요!"
          );
        }
      }
    } else if (interaction.component.data.custom_id === "startBtn") {
      // if (interaction.member.voice.channel !== waitingCh){
      //   interaction.reply("내전 대기자만 누를 수 있습니다!");
      // }else{
      interaction.reply("만드는 중...");
      //}
    } else if (
      interaction.component.data.custom_id === "team1winBtn" &&
      checkDelay
    ) {
      interaction.reply(
        `**${interaction.user.username}**님이 '1팀 승리 버튼'을 클릭했습니다.`
      );
      teamAID.forEach(async (user) => {
        const userData1 = await DB.searchUser(user);
        await DB.updateValue(userData1, "win");
      });
      teamBID.forEach(async (user) => {
        const userData2 = await DB.searchUser(user);
        await DB.updateValue(userData2, "lose");
      });
    } else if (
      interaction.component.data.custom_id === "team2winBtn" &&
      checkDelay
    ) {
      interaction.reply(
        `**${interaction.user.username}**님이 '2팀 승리 버튼'을 클릭했습니다.`
      );
      teamAID.forEach(async (user) => {
        const userData1 = await DB.searchUser(user);
        await DB.updateValue(userData1, "lose");
      });
      teamBID.forEach(async (user) => {
        const userData2 = await DB.searchUser(user);
        await DB.updateValue(userData2, "win");
      });
    }

    // if (checkDelay) {
    //   await interaction.message.delete();
    //   checkDelay = false;
    // } else {
    //   interaction.channel.send(`${interaction.user.username}야 그만눌러라...`);
    // }
  }
});

//Run Bot
client.login(token);
