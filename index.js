//Requirements
const fs = require('node:fs');
const path = require('node:path');
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  Events,
} = require("discord.js");
const DB = require("./db_api.js");
const COMMAND = require("./command.js");
const { token } = require("./config-dev.json"); //commit 시 수정

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

client.commands = new Collection();
client.btnInteractions = new Collection();
client.smInteractions = new Collection();
client.waitingRooms = new Collection();

//resister commands to bot
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('name' in command && 'execute' in command) {
		client.commands.set(command.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//resister interactions to bot
const btnInteractionsPath = path.join(__dirname, 'interactions/btn');
const btnInteractionFiles = fs.readdirSync(btnInteractionsPath).filter(file => file.endsWith('.js'));
for (const file of btnInteractionFiles) {
	const filePath = path.join(btnInteractionsPath, file);
	const interaction = require(filePath);
	if ('name' in interaction && 'execute' in interaction) {
		client.btnInteractions.set(interaction.name, interaction);
	} else {
		console.log(`[WARNING] The interaction at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const smInteractionsPath = path.join(__dirname, 'interactions/selectMenu');
const smInteractionFiles = fs.readdirSync(smInteractionsPath).filter(file => file.endsWith('.js'));
for (const file of smInteractionFiles) {
	const filePath = path.join(smInteractionsPath, file);
	const interaction = require(filePath);
	if ('name' in interaction && 'execute' in interaction) {
		client.smInteractions.set(interaction.name, interaction);
	} else {
		console.log(`[WARNING] The interaction at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//resister event to bot
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
// client.once(Events.ClientReady,(c)=>{
//   c.guilds.cache.at(1).roles.create({
//     name:"Super Cool Blue People",
//     reason:"test",
//   }).then(console.log)
//   .catch(console.error);
//  }
// )
//Run Bot
client.login(token);
/*
let teamMaker;
let teamALeader;
let draftTeamA = [];
let teamBLeader;
let draftTeamB = [];
let draftdata;
let currentMemberCount;
let teamAName = [];
let teamBName = [];
let teamAID = [];
let teamBID = [];
let teamAPower;
let teamBPower;
let waitingCh;
let subCh;

client.on("messageCreate", async (message) => {
  if (message.author.username === "kwonSM") {
    message.react("💩");
  }
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  switch (command) {
    case "team":
      if (message.member.voice.channel == null) {
        message.reply("음성 채널에 입장한 뒤 호출해주세요!");
        break;
      }
      teamMaker = message.member.user.id;
      waitingCh = message.member.voice.channel;
      teamdata = await COMMAND.makeTeam(message);
      if (teamdata != null) {
        [teamAName, teamBName, teamAID, teamBID] = teamdata;
        teamAPower = await DB.calculTeamValue(teamAID, teamAName);
        //console.log(`result:${teamAPower}`);
        teamBPower = await DB.calculTeamValue(teamBID, teamBName);
        //console.log(`result:${teamBPower}`);
        TeamWindow(message.channel);
      } else {
        message.channel.send(
          "현재 채널 접속 인원이 홀수입니다. 짝수 인원으로 맞춰주세요!"
        );
      }
      break;
  }

  if (command == "search") {
    const userData = await COMMAND.searchUser(args);
    const userDataEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`User name: ${userData[0].NAME}`)
      .addFields(
        {
          name: "승/패",
          value: `${userData[0].WIN}/${userData[0].LOSE}`,
        },
        {
          name: "승률",
          value: `${Math.round(
            (userData[0].WIN / (userData[0].WIN + userData[0].LOSE)) * 100
          )}%`,
        },
        {
          name: "LP",
          value: `${userData[0].POWER} 롤투력`,
        }
      );
    message.reply({ embeds: [userDataEmbed] });
  }

  if (command == "register") {
    await COMMAND.registerUser(message);
    message.reply("등록까지 1~2분 소요됩니다.");
  }
  if (command == "showall") {
    const allData = await DB.getAllUserData();
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("User name / Win - Lose / Winning Percentage / LoL Power")
      .addFields(allData);
    message.reply({ embeds: [exampleEmbed] });
  }

  if (command == "draft") {
    if (message.member.voice.channel == null) {
      message.reply("음성 채널에 입장한 뒤 호출해주세요!");
      return;
    }
    teamMaker = message.member.user.id;
    waitingCh = message.member.voice.channel;
    draftdata = await COMMAND.getUserInCurrentChannel(message);
    if (draftdata === null) {
      message.channel.send(
        "현재 채널 접속 인원이 홀수입니다. 짝수 인원으로 맞춰주세요!"
      );
      return;
    }
    console.log(draftdata);
    currentMemberCount = draftdata.length;
    await COMMAND.makeSelectMenu(draftdata, message);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  console.log(interaction);

  const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}

  if (interaction.component.data.custom_id === "startBtn") {
      if (interaction.member.voice.channel !== waitingCh) {
        interaction.reply("내전 대기자만 누를 수 있습니다!");
      } else {
        channellist = COMMAND.findEmptyChannel(interaction);
        if (channellist.size < 1) {
          interaction.reply("빈 음성 채널이 필요해요!");
        } else {
          subCh = channellist[0];
          COMMAND.moveTeam(waitingCh, teamAID, subCh);
          await interaction.channel.send({
            files: [{ attachment: "./assets/opening.gif" }],
          });
          interaction.reply("내전을 시작~ 하겠습니다~~🥊");
        }
      }
    } else if (interaction.component.data.custom_id === "team1winBtn") {
      interaction.reply(
        `**${interaction.user.username}**님이 '1팀 승리 버튼'을 클릭했습니다.`
      );
      COMMAND.moveTeam(subCh, teamAID, waitingCh);
      COMMAND.checkWin(teamAID, teamBID);
    } else if (interaction.component.data.custom_id === "team2winBtn") {
      interaction.reply(
        `**${interaction.user.username}**님이 '2팀 승리 버튼'을 클릭했습니다.`
      );
      COMMAND.moveTeam(waitingCh, teamBID, subCh);
      COMMAND.checkWin(teamBID, teamAID);
    }
  }
  if (interaction.isChannelSelectMenu) {
    if (
      draftdata.length == currentMemberCount ||
      draftdata.length == currentMemberCount - 1
    ) {
      if (interaction.user.id != teamMaker) {
        interaction.channel.send(
          `명령어 입력 사용자가 각 팀 주장을 뽑아야합니다.`
        );
        return;
      }
    } else if (draftdata.length % 2 == 0) {
      if (interaction.user.id != teamALeader.ID) {
        interaction.channel.send(`1팀 주장이 선택을 할 차례입니다.`);
        return;
      }
    } else if (draftdata.length % 2 == 1) {
      if (interaction.user.id != teamBLeader.ID) {
        interaction.channel.send(`2팀 주장이 선택을 할 차례입니다.`);
        return;
      }
    }
    //이거 check 함수로 빼기

    const choosenUserID = interaction.values[0];
    let idx;
    for (let i = 0; i < draftdata.length; i++) {
      if (draftdata[i].ID == choosenUserID) {
        idx = i;
        break;
      }
    }
    if (draftdata.length == currentMemberCount) {
      teamALeader = draftdata[idx];
      draftTeamA.push(draftdata[idx]);
      interaction.channel.send(`1팀 주장: ${teamALeader.NAME}`);
    } else if (draftdata.length == currentMemberCount - 1) {
      teamBLeader = draftdata[idx];
      draftTeamB.push(draftdata[idx]);
      interaction.channel.send(`2팀 주장: ${teamBLeader.NAME}`);
    } else if (draftdata.length % 2 == 0) {
      draftTeamA.push(draftdata[idx]);
      interaction.channel.send(
        `1  팀 주장 ${teamALeader.NAME}님이 ${draftdata[idx].NAME}님을 선택했습니다.`
      );
    } else {
      draftTeamB.push(draftdata[idx]);
      interaction.channel.send(
        `2  팀 주장 ${teamBLeader.NAME}님이 ${draftdata[idx].NAME}님을 선택했습니다.`
      );
    }

    if (draftTeamA.length != 0 && draftTeamB.length != 0) {
      const draftEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("팀 드래프트🚀")
        .setURL("https://youtu.be/k6FmEwkD6SQ")
        .addFields(
          {
            name: "1️⃣팀",
            value: `${draftTeamA.map((i) => i.NAME).join(", ")}`,
            inline: true,
          },
          {
            name: "LP 합계",
            value: `${draftTeamA.reduce((a, b) => a + b.POWER, 0)}`,
            inline: true,
          },

          { name: "\u200b", value: "\u200b" },
          {
            name: "2️⃣팀",
            value: `${draftTeamB.map((i) => i.NAME).join(", ")}`,
            inline: true,
          },
          {
            name: "LP 합계",
            value: `${draftTeamB.reduce((a, b) => a + b.POWER, 0)}`,
            inline: true,
          }
        );
      await interaction.channel.send({
        embeds: [draftEmbed],
      });
    }
    draftdata.splice(idx, 1);
    await interaction.message.delete();
    if (draftdata.length == 0) {
      interaction.channel.send("팀구성 완료");
      return;
    }
    await COMMAND.makeSelectMenu(draftdata, interaction);
  }
});
*/

