import { Command } from "../../structures/Command";
import { NominationController } from "../../controller/NominationController";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ExpandedNomination } from "../../typings/Nomination";

function GenerateEmbed(nominations: ExpandedNomination[], start: number, pageMax = 10): MessageEmbed {
    const current = nominations.slice(start, start + pageMax);
    return new MessageEmbed({
        title: `Showing Nominations ${start + 1}-${start + current.length} of ${nominations.length}`,
        description: current.map(n => `<@${n.user.discord_id}>: [${n.movie.title} (${n.movie.year})](https://www.imdb.com/title/${n.movie.imdbID}) - **${n.category}**`).join("\n")
    });
}

function compareCategory(a: ExpandedNomination, b: ExpandedNomination) {
    if (a.category > b.category) return 1;
    if (a.category < b.category) return -1;
    return 0;
}

function compareUserId(a: ExpandedNomination, b: ExpandedNomination) {
    if (a.user.discord_id > b.user.discord_id) return 1;
    if (a.user.discord_id < b.user.discord_id) return -1;
    return 0;
}

async function HandleCurrentNominations({ interaction }) {
    const MAX_PER_PAGE = 10;
    let nominations = await NominationController.getCurrentNominations();
    nominations = nominations.sort(compareCategory).sort(compareUserId);

    if (!nominations || !nominations.length) {
        return interaction.followUp("No nominations found.");
    }

    const canFitOnOnePage = nominations.length <= MAX_PER_PAGE;

    if (canFitOnOnePage) {
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle("Current Nominations")
            .setDescription(nominations.map(n =>
                `<@${n.user.discord_id}>: [${n.movie.title} (${n.movie.year})](https://www.imdb.com/title/${n.movie.imdbID}) - **${n.category}**`)
                .join("\n"));
        interaction.followUp({ embeds: [embed], ephemeral: true });
    } else {
        const backId = 'back'
        const forwardId = 'forward'
        const backButton = new MessageButton({
            style: 'SECONDARY',
            label: 'Back',
            emoji: '⬅️',
            customId: backId
        })
        const forwardButton = new MessageButton({
            style: 'SECONDARY',
            label: 'Forward',
            emoji: '➡️',
            customId: forwardId
        })
        const embed = GenerateEmbed(nominations, 0, MAX_PER_PAGE);
        const message = await interaction.followUp({
            embeds: [embed],
            components: canFitOnOnePage
                ? []
                : [new MessageActionRow({ components: [forwardButton] })],
            ephemeral: true
        });

        const collector = message.createMessageComponentCollector();

        let currentIndex = 0
        collector.on('collect', async (interaction) => {
            // Increase/decrease index
            interaction.customId === backId ? (currentIndex -= MAX_PER_PAGE) : (currentIndex += MAX_PER_PAGE)
            // Respond to interaction by updating message with new embed
            await interaction.update({
                embeds: [GenerateEmbed(nominations, currentIndex, MAX_PER_PAGE)],
                components: [
                    new MessageActionRow({
                        components: [
                            // back button if it isn't the start
                            ...(currentIndex ? [backButton] : []),
                            // forward button if it isn't the end
                            ...(currentIndex + MAX_PER_PAGE < nominations.length ? [forwardButton] : [])
                        ]
                    })
                ]
            })
        });
    }
}

export default new Command({
    name: "current_nominations",
    description: "View current nominations!",
    run: HandleCurrentNominations,
})