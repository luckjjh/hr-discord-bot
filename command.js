const {
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

const DB = require("./db_api.js");
var exports = (module.exports = {});

exports.rollDice = function () {
  return Math.floor(Math.random() * 100);
};

exports.registerUser = async function (message) {
  let onlineUserArr = [];
  message.guild.members.fetch().then((fetchedMembers) => {
    fetchedMembers.forEach((k, v) => {
      let curMem = message.guild.members.cache.get(k.id);
      if (curMem.voice.channel) {
        onlineUserArr.push(k.user.username);
      }
    });
    onlineUserArr.forEach(async (item) => {
      await DB.addToDatabase(item);
    });
  });
};

exports.makeTeam = async function (message) {
  var channel = await message.guild.channels.fetch(
    message.member.voice.channel.id
  );
  if (channel.members.size % 2 === 1) {
    return null;
  } else {
    let waiting = [];
    channel.members.forEach((k, v) => {
      let nick_id = [k.displayName, k.id, Math.floor(Math.random() * 1000)];
      waiting.push(nick_id);
    });
    waiting.sort((a, b) => {
      return a[2] >= b[2] ? 1 : -1;
    });
    const half = channel.members.size / 2;
    let a_name = [];
    let b_name = [];
    let a_id = [];
    let b_id = [];
    for (let i = 0; i < half; i++) {
      a_name.push(waiting[i][0]);
      a_id.push(waiting[i][1]);
      b_name.push(waiting[i + half][0]);
      b_id.push(waiting[i + half][1]);
    }
    return [a_name, b_name, a_id, b_id];
  }
};

exports.findEmptyChannel = function (interaction) {
  channel_list = [];
  interaction.guild.channels.cache.forEach((k) => {
    // channel type 2: voice
    if (k.type == 2) {
      if (k.id != interaction.guild.afkChannelId) {
        if (k.members.size == 0) {
          channel_list.push(k);
          return channel_list;
        }
      }
    }
  });
  return channel_list;
};

exports.moveTeam = async function (waiting, teamid, channel) {
  waiting.members.forEach((k) => {
    if (teamid.includes(k.id)) {
      k.voice.setChannel(channel);
    }
  });
};

exports.checkWin = async function (winner, loser) {
  winner.forEach(async (name) => {
    DB.updateValue(winner, "win");
  });
  loser.forEach(async (name) => {
    DB.updateValue(loser, "lose");
  });
};

exports.searchUser = async function (userName) {
  return DB.searchUser(userName);
};

exports.getUserInCurrentChannel = async function (message) {
  let channel = await message.guild.channels.fetch(
    message.member.voice.channel.id
  );
  if (channel.members.size % 2 === 1) {
    return null;
  }
  let userList = [];

  for (let item of channel.members) {
    const currentUserData = await DB.searchUser(item[0], false);
    userList.push(...currentUserData);
  }
  return userList;
};

exports.makeSelectMenu = async function (userList, message) {
  let selectList = [];
  for (let i = 0; i < userList.length; i++) {
    let tempData = new StringSelectMenuOptionBuilder()
      .setLabel(userList[i].NAME)
      .setDescription(
        `W/L: ${userList[i].WIN}/${userList[i].LOSE} LP:${userList[i].POWER}`
      )
      .setValue(`${userList[i].ID}`);
    selectList.push(tempData);
  }
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId("drafter")
    .setPlaceholder("")
    .addOptions(selectList);
  const row = new ActionRowBuilder().addComponents(selectMenu);
  await message.reply({ components: [row] });
};

// exports.makeDraft = async function (message) {
//   let teamdata = await getUserInCurrentChannel(message);
//   if (teamdata === null) {
//     message.channel.send(
//       "현재 채널 접속 인원이 홀수입니다. 짝수 인원으로 맞춰주세요!"
//     );
//     return;
//   }
//   let userCount = teamdata.length;
//   // while (userCount > 0) {
//   //   await COMMAND.makeSelectMenu(teamdata, message);
//   //   userCount--;
//   // }
//   // 결과보이기
// };
