import { SettingsController } from "../../controller/SettingsController";
import { Command } from "../../structures/Command";
import { RunOptions } from "../../typings/Command";

async function HandleSetAnnouncementChannel({ interaction, args }: RunOptions) {
    const guildID = interaction.guildId;
    const channelID = args.getChannel("channel").id;

    try {
        SettingsController.updateAnnouncementChannel(guildID, channelID);
    } catch (err) {
        return interaction.followUp(err.message);
    }
    interaction.followUp(`Announcement channel set to <#${channelID}>`);
}

export default new Command({
    name: "set_announcement_channel",
    description: "Set which channel to send announcements to",
    userPermissions: ["ADMINISTRATOR"],
    ephemeral: true,
    options: [
        {
            name: "channel",
            description: "The channel to send announcements to",
            required: true,
            type: "CHANNEL",

        }
    ],
    run: HandleSetAnnouncementChannel
});