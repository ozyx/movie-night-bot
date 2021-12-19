import { Command } from "../../structures/Command";
import { SeasonController } from "../../controller/SeasonController"

async function HandleEndSeason({ interaction }) {
    try {
        const season = await SeasonController.endSeason();
        interaction.followUp(`Season ${season.season_num} has ended!`);
    } catch (err) {
        return interaction.followUp(err.message);
    }
}

export default new Command({
    name: "end_season",
    description: "End the current season",
    userPermissions: ["ADMINISTRATOR"],
    run: HandleEndSeason
});