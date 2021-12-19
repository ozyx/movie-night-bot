import { Command } from "../../structures/Command";
import { SeasonController } from "../../controller/SeasonController"

async function HandleStartSeason({ interaction }) {
    let season;
    try {
        season = await SeasonController.startSeason();
    } catch (err) {
        return interaction.followUp(err.message);
    }
    interaction.followUp(`Season ${season.season_num} has started!`);
}

export default new Command({
    name: "start_season",
    description: "Start a new season",
    userPermissions: ["ADMINISTRATOR"],
    run: HandleStartSeason
});