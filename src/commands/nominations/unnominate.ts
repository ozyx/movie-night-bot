import { NominationController } from "../../controller/NominationController";
import { SeasonController } from "../../controller/SeasonController";
import { UserController } from "../../controller/UserController";
import { Command } from "../../structures/Command";
import { RunOptions } from "../../typings/Command";

async function HandleUnnominate({ interaction, args }: RunOptions) {
    const category = args.getString("category");
    // Create user if not exists
    const user = await UserController.getOrCreateUser(interaction.member.user.id);
    try {
        await NominationController.canUnnominate(user._id, category);
    } catch (err) {
        return interaction.followUp(err.message);
    }

    const season_num = await SeasonController.getNextSeasonNum();

    const unnomination = await NominationController.unnominate(user._id, season_num, category);

    if (!unnomination) {
        return interaction.followUp("Something went wrong.");
    }

    interaction.followUp(`You have successfully unnominated your ${category} pick for this season.`);
}

export default new Command({
    name: "unnominate",
    description: "Unnominate a movie!",
    run: HandleUnnominate,
    ephemeral: true,
    options: [
        {
            name: "category",
            description: "The category of the movie you wish to unnominate (i.e.: CLASS or TRASH)",
            required: true,
            choices: [{
                name: "class",
                value: "CLASS"
            },
            {
                name: "trash",
                value: "TRASH"
            }],
            type: "STRING",
        }]
});