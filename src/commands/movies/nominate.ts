import { Command } from "../../structures/Command";
import { UserController } from "../../controller/UserController";
import { MovieController } from "../../controller/MovieController";
import { NominationController } from "../../controller/NominationController";
import { MessageEmbed } from "discord.js";
import { SeasonController } from "../../controller/SeasonController";

function isValidImdbId(imdbId) {
    return /^.*(tt\d{7}|\d{8}).*$/.test(imdbId);
}

function extractImdbId(url) {
    return /^.*(tt\d{7}|\d{8}).*$/.exec(url)[1];
}

async function HandleNominate({ interaction, args }) {
    let imdbId = args.getString("imdbid");
    const category = args.getString("category");

    // First, validate the IMDB ID
    if (!isValidImdbId(imdbId)) {
        return interaction.followUp("Invalid IMDB ID.");
    }

    // Extract IMDB ID from URL (incase it's a URL)
    imdbId = extractImdbId(imdbId);

    // Create user if not exists
    const user = await UserController.getOrCreateUser(interaction.member.user.id);

    // Get the movie
    // Create movie if not exists
    const movie = await MovieController.getOrCreateMovie(imdbId);

    try {
        await NominationController.canNominate(user._id, category, movie._id);
    } catch (err) {
        return interaction.followUp(err.message);
    }

    const season_num = await SeasonController.getNextSeasonNum();

    // Create nomination
    const nomination = await NominationController.nominate(user._id, movie._id, season_num, category);

    if (!nomination) {
        return interaction.followUp("Something went wrong.");
    }

    interaction.followUp({
        embeds: [
            new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`${movie.title} (${movie.year})`)
                .setURL(`https://www.imdb.com/title/${imdbId}`)
                .setAuthor("Nomination Successful!")
                .addFields([
                    { name: "Nominator", value: `<@${user.discord_id}>`, inline: true },
                    { name: "Category", value: category, inline: true },
                    { name: "Season", value: `${nomination.season_num}`, inline: true },
                    { name: "Actors", value: movie.actors },
                    { name: "Genre", value: movie.genre, inline: true },
                    { name: "Rating", value: movie.rated, inline: true },
                    { name: "Runtime", value: movie.runtime, inline: true },
                    { name: "Director", value: movie.director },
                    { name: "Writer", value: movie.writer },
                ])
                .setImage(movie.poster)
                .setThumbnail(movie.poster)
                .setDescription(movie.plot)
                .setTimestamp()
        ],
        ephemeral: true
    });
};

export default new Command({
    name: "nominate",
    description: "Nominate a movie!",
    run: HandleNominate,
    options: [
        {
            name: "imdbid",
            description: "The IMDB ID or IMDB URL of the movie (i.e.: tt0123456 or https://www.imdb.com/title/tt0413267)",
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