import { CommandInteractionOptionResolver, MessageEmbed } from "discord.js";
import { client } from "../bot";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";

export default new Event("interactionCreate", async (interaction) => {
    // Chat input commands
    if (!interaction.isCommand()) return;
    await interaction.deferReply();
    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.followUp(`That command does not exist!`);
    if (!command.name) return interaction.followUp(`That command does not exist!`);
    if (command.userPermissions) {
        if (!interaction.memberPermissions.has(command.userPermissions)) {
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor('RANDOM')
                        .addField('Error', `You do not have required permissions to use this command! \n Missing perms: **${command.userPermissions}**`)
                ]
            });
        }
    }
    command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction
    })
});