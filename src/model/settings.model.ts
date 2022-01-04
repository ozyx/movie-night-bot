import mongoose from "mongoose";
import { ISettings } from "../typings/Settings";

interface SettingsInput {
    guildID: ISettings["guildID"];
    announcementChannelID?: ISettings["announcementChannelID"];
}

type SettingsDocument = SettingsInput & mongoose.Document;

const SettingsType: Record<keyof ISettings, unknown> = {
    guildID: {
        type: String,
        required: true,
        unique: true
    },
    announcementChannelID: {
        type: String
    }
}


const settingsSchema = new mongoose.Schema(SettingsType);

export { settingsSchema, SettingsDocument, SettingsInput }