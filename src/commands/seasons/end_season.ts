import { Command } from "../../structures/Command";
import { SeasonController } from "../../controller/SeasonController"

async function HandleEndSeason({ interaction }) {
    let season;
    try {
        season = await SeasonController.endSeason();
    } catch (err) {
        return interaction.followUp(err.message);
    }
    interaction.followUp(`Season ${season.season_num} has ended!`);
}

export default new Command({
    name: "end_season",
    description: "End the current season",
    userPermissions: ["ADMINISTRATOR"],
    run: HandleEndSeason
});