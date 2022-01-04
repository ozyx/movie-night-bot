import { SettingsInput } from "../model/settings.model";
import { updateAnnouncementChannel } from "../service/settings.service";

export class SettingsController {
    public static async updateAnnouncementChannel(guildId: string, channelId: string): Promise<void> {
        const input: SettingsInput = {
            guildID: guildId,
            announcementChannelID: channelId,
        };

        const updatedSettings = await updateAnnouncementChannel(input);

        if (!updatedSettings) {
            throw new Error("Could not update announcement channel");
        }
    }
}