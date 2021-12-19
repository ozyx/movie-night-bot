import { Command } from "../../structures/Command";
import { NominationController } from "../../controller/NominationController";
import { SeasonController } from "../../controller/SeasonController";
import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ExpandedNomination } from "../../typings/Nomination";
import { RunOptions } from "../../typings/Command";

function GenerateEmbed(seasonNum: number, nominations: ExpandedNomination[], start: number, pageMax = 10): MessageEmbed {
    const current = nominations.slice(start, start + pageMax);
    return new MessageEmbed({
        title: `Movie Night Season #${seasonNum}`,
        timestamp: new Date(),
        description: current.map((n, idx) =>
            `${idx + 1 + start}. <@${n.user.discord_id}>: [${n.movie.title} (${n.movie.year})](https://www.imdb.com/title/${n.movie.imdbID}) - **${n.category}**`)
            .join("\n")
    }).setAuthor(`Showing Nominations ${start + 1}-${start + current.length} of ${nominations.length}`);
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

async function HandleCurrentNominations({ interaction, args }: RunOptions) {
    const onlyMine = args.getBoolean("only_mine");
    const userId = onlyMine ? interaction.member.user.id : null;
    const MAX_PER_PAGE = 10;
    const nextSeasonNum = await SeasonController.getNextSeasonNum();
    let nominations = await NominationController.getCurrentNominations(userId);

    if (!nominations || !nominations.length) {
        return interaction.followUp("No nominations found.");
    }

    if (nominations.length > 1) {
        nominations = nominations.sort(compareCategory).sort(compareUserId);
    }

    const canFitOnOnePage = nominations.length <= MAX_PER_PAGE;

    if (canFitOnOnePage) {
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(`Current Nominations`)
            .setTitle(`Movie Night Season #${nextSeasonNum}`)
            .setDescription(nominations.map((n, idx) =>
                `${idx + 1}. <@${n.user.discord_id}>: [${n.movie.title} (${n.movie.year})](https://www.imdb.com/title/${n.movie.imdbID}) - **${n.category}**`)
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
        const embed = GenerateEmbed(nextSeasonNum, nominations, 0, MAX_PER_PAGE);
        const message = await interaction.followUp({
            embeds: [embed],
            components: canFitOnOnePage
                ? []
                : [new MessageActionRow({ components: [forwardButton] })],
            ephemeral: true
        }) as Message;

        const collector = message.createMessageComponentCollector();

        let currentIndex = 0
        collector.on('collect', async (interaction: ButtonInteraction) => {
            // Increase/decrease index
            interaction.customId === backId ? (currentIndex -= MAX_PER_PAGE) : (currentIndex += MAX_PER_PAGE)
            // Respond to interaction by updating message with new embed
            await interaction.update({
                embeds: [GenerateEmbed(nextSeasonNum, nominations, currentIndex, MAX_PER_PAGE)],
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
    options: [
        {
            name: "only_mine",
            description: "Only show your current nominations.",
            type: "BOOLEAN",
            required: false,
        }
    ]
})