const {helloWindow} = require("../components/helloWindow.js");
const {gameIntroWindow} = require("../components/gameIntroWindow.js");
const {gameClosingWindow} = require("../components/gameClosingWindow.js")
const DB = require("../db_api.js");
const RandomStage = require("./randomStage.js");
const DraftStage = require("./draftStage.js");

class WaitingRoom{
    constructor(guildId,host,mainVoiceChannel,subVoiceChannel,textChannel,members){
        this.guildId=guildId;
        this.host=host;
        this.mainVoiceChannel=mainVoiceChannel;
        this.subVoiceChannel=subVoiceChannel;
        this.textChannel=textChannel;

        this.players=members;
        this.draftPlayers=[];

        this.stage=new RandomStage();

        this.teamA=[];
        this.teamB=[];

        this.teamAName="";
        this.teamBName="";
        this.teamAPower=0;
        this.teamBPower=0;
        this.teamAWinningRate=0;
        this.teamBWinningRate=0;

        this.eloWeight=20;
    }

    // Team mode
    SetStageRandom(){
        this.stage=new RandomStage(this);
        return;
    }

    CopyPlayer(){
        const size=this.players.size;
        this.draftPlayers=[];
        for (let i=0;i<size;i++){
            this.draftPlayers.push(this.players.at(i));
        }
        return;
    }

    SetStageDraft(){
        this.stage=new DraftStage(this);
        this.CopyPlayer();
        return;
    }

    //Check Function
    CheckHostByID(targetId){
        return this.host.user.id==targetId ? 1 : 0;
    }

    CheckPlayersEven(){
        return this.players.size%2 ? 0 : 1;
    }

    CheckTeamALeaderByID(targetId){
        return this.teamA[0].user.id==targetId ? 1 : 0;
    }

    CheckTeamBLeaderByID(targetId){
        return this.teamB[0].user.id==targetId ? 1 : 0;
    }

    //Control member
    AddPlayer(targetId){
        const target = this.mainVoiceChannel.members.get(targetId);
        this.players.set(targetId,target);
        return;
    }

    AddPlayerToTeamA(targetId){
        const size= this.draftPlayers.length;
        for (let i=0;i<size;i++){
            let target=this.draftPlayers[i];
            if (target==undefined) continue;
            if (this.draftPlayers[i].id==targetId){
                this.teamA.push(this.draftPlayers[i]);
                delete this.draftPlayers[i];
                return;
            }
        }
    }

    AddPlayerToTeamB(targetId){
        const size= this.draftPlayers.length;
        for (let i=0;i<size;i++){
            let target=this.draftPlayers[i];
            if (target==undefined) continue;
            if (this.draftPlayers[i].id==targetId){
                this.teamB.push(this.draftPlayers[i]);
                delete this.draftPlayers[i];
                return;
            }
        }
    }

    RemovePlayer(targetId){
        this.players.delete(targetId);
        return;    
    }

    //DB 정보를 읽어서 자료 구조에 추가
    async SynchronizeWithDB(){
        const size=this.players.size;
        for (let i=0;i<size;i++){
            const data=await DB.getUser(this.guildId, this.players.at(i).user.id);
            if (data){
                this.players.at(i).win=data["WIN"];
                this.players.at(i).lose=data["LOSE"];
                this.players.at(i).power=data["POWER"];
                this.players.at(i).streak=data["STREAK"];
            }else{
                DB.insertUser(this.guildId,this.players.at(i).user.id, this.players.at(i).displayName);
                this.players.at(i).win=0;
                this.players.at(i).lose=0;
                this.players.at(i).power=1000;
                this.players.at(i).streak=0;
            }
        }
    }

    SetTeamNames(){
        const size=this.teamA.length;
        let name=[];
        for (let i=0;i<size;i++){
            name.push(this.teamA[i].displayName);
        }
        this.teamAName = name.join(",");

        name=[];
        for (let i=0;i<size;i++){
            name.push(this.teamB[i].displayName);
        }
        this.teamBName = name.join(",");
    }

    SetTeamPowers(){
        const size=this.teamA.length;
        this.teamAPower=0;
        for (let i=0;i<size;i++){
            this.teamAPower+=this.teamA[i].power;
        }

        this.teamBPower=0;
        for (let i=0;i<size;i++){
            this.teamBPower+=this.teamB[i].power;
        }
    }

    CalculWinningRate(){
        this.teamAWinningRate=1/(Math.pow(10,(this.teamBPower-this.teamAPower)/400)+1)*100;
        this.teamBWinningRate=1/(Math.pow(10,(this.teamAPower-this.teamBPower)/400)+1)*100;
    }

    SetTeamInfo(){
        this.SetTeamNames();
        this.SetTeamPowers();
        this.CalculWinningRate();
    }

    //Get Data from this class

    GetPlayerNames(){
        let name=[];
        const size=this.players.size;
        if (size==0){
            return "No one";
        }else{
            for (let i=0;i<size;i++){
                name.push(this.players.at(i).displayName);
            }
            return name.join(",");
        }
    }


    //Send UI Windows
    
    SendHelloWindow(){
        this.textChannel.send(helloWindow(this));
        return;
    }

    async UpdateDB(){
        const size=this.players.size;
        const db=await DB.OpenDB();
        for (let i=0;i<size;i++){
            DB.updateUserValue(db, this.guildId, this.players.at(i).user.id, this.players.at(i).win, this.players.at(i).lose, this.players.at(i).power, this.players.at(i).streak);
        }
        await DB.CloseDB(db);
    }

    MakeTeam(){
        // teamList has index of players
        this.stage.MakeTeamByStage(this.players.size);
    }

    SendStageWindow(){
        const window = this.stage.MakeStageWindow(this.teamAName,this.teamBName, this.teamAPower,this.teamBPower)
        this.textChannel.send(window);
    }

    SendOpeningWindow(){
        const window=gameIntroWindow(this.teamAName,this.teamBName, this.teamAPower,this.teamBPower,"adsa","asdasd",this.teamAWinningRate,this.teamBWinningRate);
        this.textChannel.send(window);
    }

    MoveEachTeamToVoiceChannel(){
        const size= this.teamA.length;
        for (let i=0;i<size;i++){
            this.teamA[i].voice.setChannel(this.mainVoiceChannel);
            this.teamB[i].voice.setChannel(this.subVoiceChannel);
        }
    }

    MoveAllToVoiceChannel(){
        const size= this.players.size;
        for (let i=0;i<size;i++){
            this.players.at(i).voice.setChannel(this.mainVoiceChannel);
        }
    }

    //We = 1 / (10(P op – P me)/400 + 1)
    //Pa = Pb + K * (W - We)
    ReflectResult(winner){
        const K=this.eloWeight;
        if (winner=="A"){
            const increasement = K * (100 - this.teamAWinningRate)/100;
            const size= this.teamA.length;
            for (let i=0;i<size;i++){
                this.teamA[i].win++;
                this.teamA[i].power+=increasement;
                this.teamA[i].streak= this.teamA[i].streak<0 ? 1 : this.teamA[i].streak+1;
            }
            for (let i=0;i<size;i++){
                this.teamB[i].lose++;
                this.teamB[i].power-=increasement;
                this.teamB[i].streak= this.teamB[i].streak>0 ? -1 : this.teamB[i].streak-1;
            }

        }else{
            const increasement = K * (100 - this.teamBWinningRate)/100;
            const size= this.teamB.length;
            for (let i=0;i<size;i++){
                this.teamB[i].win++;
                this.teamB[i].power+=increasement;
                this.teamB[i].streak= this.teamB[i].streak<0 ? 1 : this.teamB[i].streak+1;
            }
            for (let i=0;i<size;i++){
                this.teamA[i].lose++;
                this.teamA[i].power-=increasement;
                this.teamA[i].streak= this.teamA[i].streak>0 ? -1 : this.teamA[i].streak-1;
            }
        }
    }

    SendClosingWindow(){
        const window=gameClosingWindow();
        this.textChannel.send(window);        
    }
}

module.exports = WaitingRoom;