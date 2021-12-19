import { Command } from "../../structures/Command";
import { UserController } from "../../controller/UserController";
import { MovieController } from "../../controller/MovieController";
import { NominationController } from "../../controller/NominationController";

function isValidImdbId(imdbId) {
    return /^tt(\d{7}|\d{8})$/.test(imdbId);
}


async function HandleNominate({ interaction, args }) {
    const imdbId = args.getString("imdbid");
    const category = args.getString("category");

    // First, validate the IMDB ID
    if (!isValidImdbId(imdbId)) {
        return interaction.followUp("Invalid IMDB ID.");
    }

    // Create user if not exists
    const user = await UserController.getOrCreateUser(interaction.member.user.id);

    try {
        await NominationController.canNominate(user._id, category);
    } catch (err) {
        return interaction.followUp(err.message);
    }

    // Get the movie
    // Create movie if not exists
    const movie = await MovieController.getOrCreateMovie(imdbId);

    // Create nomination
    const nomination = await NominationController.nominate(user._id, movie._id, category);

    if (!nomination) {
        return interaction.followUp("Something went wrong.");
    }

    interaction.followUp(`You nominated "${movie.title}" (${movie.year}) as your ${category} pick for ${nomination.season_num}!`);
};

export default new Command({
    name: "nominate",
    description: "Nominate a movie!",
    run: HandleNominate,
    options: [
        {
            name: "imdbid",
            description: "The imdbID of the movie you with to nominate (i.e.: tt0123456)",
            required: true,
            type: "STRING",
        },
        {
            name: "category",
            description: "The category of the movie you wish to nominate (i.e.: CLASS or TRASH)",
            required: true,
            choices: [{
                name: "class",
                value: "CLASS"
            },
            {
                name: "trash",
                value: "TRASH"
            }
            ],
            type: "STRING",
        }
    ]
})