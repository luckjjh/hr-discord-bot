const sqlite3 = require("sqlite3");
let top3List = [];

var exports = (module.exports = {});

exports.OpenDB = async function () {
  const db = new sqlite3.Database(
    "./hr_db.db",
    sqlite3.OPEN_READWRITE,
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  return db;
}

exports.CloseDB = async function (db){
  db.close();
  return;
} 

exports.updateUserValue = async function (db, guildID, id ,win, lose, power, streak) {
  const update_query = `UPDATE user SET WIN =${win}, LOSE =${lose}, POWER =${power}, STREAK =${streak}  WHERE GUILDID=${guildID} AND ID=${id}`;
  db.run(update_query, function (err) {
    if (err) {
      console.log(err.message);
    }
  });
};

exports.insertUser = function (guildID, id, name) {
  const db = new sqlite3.Database(
    "./hr_db.db",
    sqlite3.OPEN_READWRITE,
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  const query = `INSERT INTO user(GUILDID,ID,NAME,WIN,LOSE,POWER,STREAK) VALUES(${guildID},${id},"${name}",0,0,1000,0)`;
  db.run(query, function (err) {
    if (err) {
      console.log(err.message);
    }
  });
  db.close();
};

exports.getUser = async function (guildID, id) {
  const db = new sqlite3.Database(
    "./hr_db.db",
    sqlite3.OPEN_READWRITE,
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  const find_query = `SELECT * from user WHERE GUILDID=${guildID} AND ID=${id}`;
  const user_data = await new Promise((resolve) => {
    db.get(find_query, (err, rows) => {
      if (err) {
        resolve({ error: "error message" });
      } else {
        resolve(rows);
      }
    });
  });
  db.close();
  return user_data;
};

exports.getAllUserData = async function () {
  const db = new sqlite3.Database(
    "./hr_db.db",
    sqlite3.OPEN_READWRITE,
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  const find_query = `SELECT * from user`;
  const user_data = await new Promise((resolve) => {
    db.all(find_query, (err, rows) => {
      if (err) {
        resolve({ error: "error message" });
      } else {
        resolve(rows);
      }
    });
  });
  db.close();
  let allData = [];
  user_data.forEach((item) => {
    const percent = Math.round(
      (item["WIN"] / (item["LOSE"] + item["WIN"])) * 100
    );
    percent.toFixed(1);
    allData.push({
      name: `${item["NAME"]}`,
      value: `${item["WIN"]} - ${item["LOSE"]} / ${percent}% / ${item["POWER"]} LP`,
    });
  });
  allData.sort(function (a, b) {
    if (a.name > b.name) return 1;
    else return -1;
  });
  return allData;
};

exports.getTop3 = async function (guildID,desc) {
  const db = new sqlite3.Database(
    "./hr_db.db",
    sqlite3.OPEN_READWRITE,
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  const find_query = `SELECT * from user WHERE GUILDID=${guildID}`;
  const user_data = await new Promise((resolve) => {
    db.all(find_query, (err, rows) => {
      if (err) {
        resolve({ error: "error message" });
      } else {
        resolve(rows);
      }
    });
  });
  user_data.sort(function (a, b) {
    if (desc) {
      if (a["POWER"] < b["POWER"]) {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (a["POWER"] > b["POWER"]) {
        return 1;
      } else {
        return -1;
      }
    }
  });
  top3List = [];
  if (user_data.length < 3) {
    for (i = 0; i < user_data.length; i++) {
      top3List.push(user_data[i]);
    }
    for (i = 0; i < 3 - user_data.length; i++) {
      top3List.push({
        NAME: "no one",
        POWER: 0,
      });
    }
  } else {
    for (i = 0; i < 3; i++) {
      top3List.push(user_data[i]);
    }
  }
  db.close();
  return top3List;
};

exports.searchUser = async function (userName, isName = true) {
  const args = isName ? "NAME" : "ID";
  const db = new sqlite3.Database(
    "./hr_db.db",
    sqlite3.OPEN_READWRITE,
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  const search_query = `SELECT * from user WHERE ${args} = '${userName}'`;
  const user_data = await new Promise((resolve) => {
    db.all(search_query, (err, rows) => {
      if (err) {
        resolve({ error: "error message" });
      } else {
        resolve(rows);
      }
    });
  });
  return user_data;
};
