import { Command } from "../../structures/Command";
import { SeasonController } from "../../controller/SeasonController"

async function HandleStartSeason({ interaction }) {
    try {
        const season = await SeasonController.startSeason();
        interaction.followUp(`Season ${season.season_num} has started!`);
    } catch (err) {
        return interaction.followUp(err.message);
    }
}

export default new Command({
    name: "start_season",
    description: "Start a new season",
    userPermissions: ["ADMINISTRATOR"],
    run: HandleStartSeason
});