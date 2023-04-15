//Requirements
const sqlite3 = require('sqlite3');
const dbClient = require("@notionhq/client");
const dbID = "adc986585ab64b5693b9399334c7d935";
const { auth, notionVersion } = require("./db_key");

const notion = new dbClient.Client({
  auth: auth,
  notionVersion: notionVersion,
});
let top3List = [];

var exports = (module.exports = {});

//Function
exports.updateValue = async function (originalData, state) {
  streak=originalData.properties.streak.number;
  bonus=1;
  switch (state) {
    case "win":
      if (2<=streak && streak<=3){
        bonus = 2;
      }else if (4==streak){
        bonus = 3;
      }else if (5<=streak){
        bonus = 4;
      }
      await notion.pages.update({
        page_id: originalData.id,
        properties: {
          win: {
            type: "number",
            number: (originalData.properties.win.number += 1),
          },
          power: {
            type: "number",
            number: (originalData.properties.power.number += 1),
          },
          streak:{
            type: "number",
            number: (streak > 0 ? streak + 1 : 1),
          },
        },
      });
      break;
    case "lose":
      if (-3<=streak && streak<=-2){
        bonus = 2;
      }else if (streak==-4){
        bonus = 3;
      }else if (streak<=-5){
        bonus = 4;
      }
      await notion.pages.update({
        page_id: originalData.id,
        properties: {
          lose: {
            type: "number",
            number: (originalData.properties.lose.number += 1),
          },
          power: {
            type: "number",
            number: (originalData.properties.power.number -= 1),
          },
          streak:{
            type: "number",
            number: (streak > 0 ? -1 : streak-1),
          },
        },
      });
      break;
  }
};


insertNewUser = function(id, name){
  const db=new sqlite3.Database('./hr_db.db',sqlite3.OPEN_READWRITE,function(err){
    if (err){
      console.log(err.message);
    }
  });
  const query = `INSERT INTO user(ID,NAME,WIN,LOSE,POWER,STREAK) VALUES(${id},"${name}",0,0,0,0)`;
  db.run(query, function(err){
    if (err){
      console.log(err.message);
    }
  });
  db.close()
}

getUser =async function(id,name){
  const db=new sqlite3.Database('./hr_db.db',sqlite3.OPEN_READWRITE,function(err){
    if (err){
      console.log(err.message);
    }
  });
  const find_query=`SELECT * from user WHERE ID=${id}`;
  const user_data = await new Promise(resolve => {
    db.get(find_query, (err,rows) =>{
      if (err){
        resolve({error: 'error message'});
      }else{
        resolve(rows);
      }
    })
  });
  db.close();
  if (user_data != undefined){
    return user_data;
  }else{
    insertNewUser(id,name);
    return {"ID": id, "NAME": name, "WIN":0,"LOSE":0,"POWER":1000,"STREAK": 0};
  }
};

exports.calculTeamValue =async function(teamIDs, teamNames){
  var teampower=0;
  for (i=0;i<teamIDs.length;i++){
    user_data=await getUser(teamIDs[i],teamNames[i]);
    teampower+=user_data["POWER"];
  }
  return teampower;
}

exports.getAllUserData = async function () {
  const db=new sqlite3.Database('./hr_db.db',sqlite3.OPEN_READWRITE,function(err){
    if (err){
      console.log(err.message);
    }
  });
  const find_query=`SELECT * from user`;
  const user_data = await new Promise(resolve => {
    db.all(find_query, (err,rows) =>{
      if (err){
        resolve({error: 'error message'});
      }else{
        resolve(rows);
      }
    })
  });
  db.close();
  let allData = [];
  user_data.forEach((item) => {
    const percent =
      (item["WIN"] / (item["LOSE"] + item["WIN"])) * 100;
    allData.push({
      name: `${item["NAME"]}`,
      value: `${item["WIN"]} - ${item["LOSE"]} / ${percent}% / ${item["POWER"]} LP`,
    });
  });
  allData.sort(function(a,b){
    if (a.name>b.name) return 1;
    else return -1;
  })
  return allData;
};

exports.getTop3 = async function (dir) {
  const db=new sqlite3.Database('./hr_db.db',sqlite3.OPEN_READWRITE,function(err){
    if (err){
      console.log(err.message);
    }
  });
  const find_query=`SELECT * from user`;
  const user_data = await new Promise(resolve => {
    db.all(find_query, (err,rows) =>{
      if (err){
        resolve({error: 'error message'});
      }else{
        resolve(rows);
      }
    })
  });
  user_data.sort(function(a,b){
    if (a["POWER"]<b["POWER"]){
      return 1;
    }else{
      return -1;
    }
  });
  top3List=[];
  console.log(user_data.length);
  if (user_data.length<3){
    for (i=0;i<user_data.length;i++){
      top3List.push(user_data[i]);
    }
    for (i=0;i<3-user_data.length;i++){
      top3List.push({
        "NAME" : "no one",
        "POWER": 0
      });
    }
  }
  db.close();
  return top3List;
};