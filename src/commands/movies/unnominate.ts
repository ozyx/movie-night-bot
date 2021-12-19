import { NominationController } from "../../controller/NominationController";
import { UserController } from "../../controller/UserController";
import { Command } from "../../structures/Command";

async function HandleUnnominate({ interaction, args }) {
    const category = args.getString("category");
    // Create user if not exists
    const user = await UserController.getOrCreateUser(interaction.member.user.id);
    try {
        NominationController.canUnnominate(user._id, category);
    } catch (err) {
        return interaction.followUp(err.message);
    }
    
    const nomination = await NominationController.unnominate(user._id, category);
    
    if (!nomination) {
        return interaction.followUp("Something went wrong.");
    }

    interaction.followUp(`You have successfully unnominated your ${category} pick for this season.`);
}

export default new Command({
    name: "unnominate",
    description: "Unnominate a movie!",
    run: HandleUnnominate,
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