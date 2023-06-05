const {chooseLeaderWindow} = require("../components/chooseLeaderWindow.js");
const {DraftStageWindow } =require("../components/draftStageWindow.js");
class DraftStage{
    constructor(waitingRoom){
        this.type="Draft";
        this.teamList=[[],[]];
        this.waitingRoom=waitingRoom;
    }

    MakeTeamByStage(size){
        //teamList[0]=> team A
        //teamList[1]=> team B
        this.teamList=[[],[]];
        this.waitingRoom.textChannel.send(chooseLeaderWindow(0,this.waitingRoom));
        return;
    }

    MakeStageWindow(teamAName, teamBName, teamAPower, teamBPower){
        return DraftStageWindow(teamAName, teamBName, teamAPower, teamBPower);
    }
}
module.exports = DraftStage;