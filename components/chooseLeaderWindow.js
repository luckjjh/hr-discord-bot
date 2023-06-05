const{
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} = require("discord.js");

const {DraftStageWindow} =require("./draftStageWindow.js");

module.exports = {
    chooseLeaderWindow(cnt, waitingRoom) {
        const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        
        const size=waitingRoom.draftPlayers.length;
        if (size==cnt){
            //waitingRoom.textChannel.send({content:"Making Team Complete!"});
            waitingRoom.SetTeamInfo();
            return DraftStageWindow(waitingRoom.teamAName, waitingRoom.teamBName, waitingRoom.teamAPower, waitingRoom.teamBPower);
        }else{
            const selectDraftTeamMenu = new StringSelectMenuBuilder()
            let contents;
            if (cnt==0){
                contents=`${waitingRoom.host}`;
                embed.setTitle(`Choose Team 1 Leader`);
                selectDraftTeamMenu.setCustomId('selectDraftTeamALeaderMenu');
            }else if (cnt==1){
                contents=`${waitingRoom.host}`;
                embed.setTitle(`Choose Team 2 Leader`);
                selectDraftTeamMenu.setCustomId('selectDraftTeamBLeaderMenu');
            }else if (cnt%2==0){
                contents=`${waitingRoom.teamA[0]} `;
                embed.setTitle(`Choose Team 1 Member`);
                selectDraftTeamMenu.setCustomId('selectDraftTeamAMemberMenu');
            }else{
                contents=`${waitingRoom.teamB[0]}`;
                embed.setTitle(`Choose Team 2 Member`);
                selectDraftTeamMenu.setCustomId('selectDraftTeamBMemberMenu');
            }

            for (let i=0;i<size;i++){
                let target=waitingRoom.draftPlayers.at(i);
                if (target==undefined) continue;
                selectDraftTeamMenu.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`${target.displayName} ${target.win}/${target.lose} LP:${target.power}`)
                        .setValue(target.id),
                )
            }

            //

            let selectRow = new ActionRowBuilder()
                .setComponents(selectDraftTeamMenu);

            let btnRow = new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                    .setCustomId("stopBtn")
                    .setLabel("Stop")
                    .setStyle(ButtonStyle.Danger),
            );
            return {content:contents, embeds: [embed], components: [selectRow,btnRow]};
        }
    }
}