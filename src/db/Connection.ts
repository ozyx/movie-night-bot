import mongoose from "mongoose";
import "dotenv/config.js";
import { movieSchema, MovieDocument } from "../model/movie.model";
import { userSchema, UserDocument } from "../model/user.model";
import { nominationSchema, NominationDocument } from "../model/nomination.model";
import { seasonSchema, SeasonDocument } from "../model/season.model";
import { settingsSchema, SettingsDocument } from "../model/settings.model";

const mongoUrl = process.env.MONGO_URL;
const env = process.env.ENVIRONMENT;
const mongoOpts = process.env.MONGO_OPTIONS;
const connectionUri = `${mongoUrl}/${env}?${mongoOpts}`;

const connection: mongoose.Connection = mongoose.createConnection(connectionUri, {});
connection.on("error", (err) => {
    console.error(err);
});
connection.once("open", () => {
    console.log("Connected to MongoDB");
});
connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
});

connection.model<MovieDocument>("Movie", movieSchema, "movies");
connection.model<UserDocument>("User", userSchema, "users");
connection.model<NominationDocument>("Nomination", nominationSchema, "nominations");
connection.model<SeasonDocument>("Season", seasonSchema, "seasons");
connection.model<SettingsDocument>("Settings", settingsSchema, "settings");

export { connection };
