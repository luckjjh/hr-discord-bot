const {RandomStageWindow} = require("../components/randomStageWindow.js");

//need to verify members are even!!
class RandomStage{
    constructor(waitingRoom){
        this.type="Random";
        this.waitingRoom=waitingRoom;
    }

    MakeTeamByStage(size){
        //teamList[0]=> team A
        //teamList[1]=> team B
        let idxArray=[];
        const teamSize=size/2;
        for (let i=0;i<size;i++){
            let idxWithRandomKey = [i,Math.floor(Math.random() * 1000)];
            idxArray.push(idxWithRandomKey);
        }
        idxArray.sort((a,b)=>{
            return a[1]>=b[1]?1:-1
        });
        this.waitingRoom.teamA=[];
        this.waitingRoom.teamB=[];
        for (let i=0;i<teamSize;i++){
            this.waitingRoom.teamA.push(this.waitingRoom.players.at(idxArray[i][0]));
        }
        for (let i=teamSize;i<size;i++){
            this.waitingRoom.teamB.push(this.waitingRoom.players.at(idxArray[i][0]));
        }
        return;
    }

    MakeStageWindow(teamAName, teamBName, teamAPower, teamBPower){
        return RandomStageWindow(teamAName, teamBName, teamAPower, teamBPower);
    }
}
module.exports = RandomStage;