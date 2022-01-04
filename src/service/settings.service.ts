import { SettingsDocument, SettingsInput } from "../model/settings.model";
import { MongoClient } from "../structures/MongoClient";
const Settings = MongoClient.getConnection().models.Settings;

export async function updateAnnouncementChannel(settings: SettingsInput): Promise<SettingsDocument> {
    return await Settings.findOneAndUpdate({ guildID: settings.guildID }, settings, { upsert: true, new: true });
}