import { Command } from "../../structures/Command";
import { NominationController } from "../../controller/NominationController";
import { SeasonController } from "../../controller/SeasonController";
import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ExpandedNomination } from "../../typings/Nomination";
import { RunOptions } from "../../typings/Command";

function GenerateEmbed(seasonNum: number, nominations: ExpandedNomination[], start: number, pageMax = 10): MessageEmbed {
    const current = nominations.slice(start, start + pageMax);
    return new MessageEmbed()
        .setColor('#7851a9')
        .setAuthor(`Showing Nominations ${start + 1}-${start + current.length} of ${nominations.length}`)
        .setTitle(`Movie Night Season #${seasonNum}`)
        .setDescription(current.map((n, idx) =>
            `${idx + start + 1}. <@${n.user.discord_id}>: [${n.movie.title} (${n.movie.year})](https://www.imdb.com/title/${n.movie.imdbID}) - **${n.category}**`)
            .join("\n"))
        .setTimestamp()
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

function getBackButton(disabled: boolean): MessageButton {
    return new MessageButton({
        style: 'PRIMARY',
        label: '◀',
        customId: 'back',
        disabled
    });
}

function getFarBackButton(disabled: boolean): MessageButton {
    return new MessageButton({
        style: 'PRIMARY',
        label: '◀◀',
        customId: 'farback',
        disabled
    });
}

function getForwardButton(disabled: boolean): MessageButton {
    return new MessageButton({
        style: 'PRIMARY',
        label: '▶',
        customId: 'forward',
        disabled
    });
}

function getFarForwardButton(disabled: boolean): MessageButton {
    return new MessageButton({
        style: 'PRIMARY',
        label: '▶▶',
        customId: 'farforward',
        disabled
    });
}

function getMessageActionRow(currentIndex: number, nominations: ExpandedNomination[], pageMax: number): MessageActionRow {
    const backButton = getBackButton(currentIndex === 0);
    const farBackButton = getFarBackButton(currentIndex === 0);
    const forwardButton = getForwardButton(currentIndex + pageMax >= nominations.length);
    const farForwardButton = getFarForwardButton(currentIndex + pageMax >= nominations.length);
    return new MessageActionRow({ components: [farBackButton, backButton, forwardButton, farForwardButton] });
}

async function HandleCurrentNominations({ interaction, args }: RunOptions) {
    const onlyMine = args.getBoolean("only_mine");
    const userId = onlyMine ? interaction.member.user.id : null;
    const MAX_PER_PAGE = 10;
    const seasonNum = args.getNumber("season_num") || await SeasonController.getNextSeasonNum();

    let nominations = await NominationController.getNominations(seasonNum, userId);

    if (!nominations || !nominations.length) {
        return interaction.followUp("No nominations found.");
    }

    if (nominations.length > 1) {
        nominations = nominations.sort(compareCategory).sort(compareUserId);
    }

    const canFitOnOnePage = nominations.length <= MAX_PER_PAGE;

    if (canFitOnOnePage) {
        const embed = GenerateEmbed(seasonNum, nominations, 0, MAX_PER_PAGE);
        interaction.followUp({ embeds: [embed], ephemeral: false });
    } else {
        const embed = GenerateEmbed(seasonNum, nominations, 0, MAX_PER_PAGE);
        const message = await interaction.followUp({
            embeds: [embed],
            components: [new MessageActionRow({
                components: [
                    getFarBackButton(true),
                    getBackButton(true),
                    getForwardButton(false),
                    getFarForwardButton(false)]
            })],
            ephemeral: true
        }) as Message;

        const collector = message.createMessageComponentCollector();

        let currentIndex = 0
        collector.on('collect', async (interaction: ButtonInteraction) => {
            // Increase/decrease index
            switch (interaction.customId) {
                case 'farback':
                    currentIndex = 0;
                    break;
                case 'back':
                    currentIndex -= MAX_PER_PAGE;
                    break;
                case 'forward':
                    currentIndex += MAX_PER_PAGE;
                    break;
                case 'farforward':
                    const remainder = nominations.length % MAX_PER_PAGE;
                    currentIndex = remainder ? nominations.length - remainder : nominations.length - MAX_PER_PAGE;
                    break;
            }

            // Respond to interaction by updating message with new embed
            await interaction.update({
                embeds: [GenerateEmbed(seasonNum, nominations, currentIndex, MAX_PER_PAGE)],
                components: [
                    getMessageActionRow(currentIndex, nominations, MAX_PER_PAGE),
                ]
            })
        });
    }
}

export default new Command({
    name: "view_nominations",
    description: "View current and previous seasons' nominations!",
    run: HandleCurrentNominations,
    ephemeral: true,
    options: [
        {
            name: "season_num",
            description: "The season number to view. Defaults to the next season.",
            type: "NUMBER",
            required: false,
        },
        {
            name: "only_mine",
            description: "Only show your current nominations.",
            type: "BOOLEAN",
            required: false,
        },
    ]
})