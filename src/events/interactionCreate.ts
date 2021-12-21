import { CommandInteractionOptionResolver, MessageEmbed } from "discord.js";
import { client } from "../bot";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";

export default new Event("interactionCreate", async (interaction) => {
    // Chat input commands
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.reply(`That command does not exist!`);
    if (!command.name) return interaction.reply(`That command does not exist!`);
    if (command.userPermissions) {
        if (!interaction.memberPermissions.has(command.userPermissions)) {
            console.log(`User ${interaction.member.user.toString} tried to use command ${command.name} but did not have the required permissions!`);
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RANDOM')
                        .addField('Error', `You do not have required permissions to use this command! \n Missing perms: **${command.userPermissions}**`)
                ],
                ephemeral: true
            });
        }
    }
    await interaction.deferReply({ ephemeral: command.ephemeral });
    command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction
    });
});