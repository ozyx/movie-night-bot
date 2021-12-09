import mongoose from "mongoose";
import "dotenv/config.js";
import { movieSchema, MovieDocument } from "../model/movie.model";
import { userSchema, UserDocument } from "../model/user.model";
import { nominationSchema, NominationDocument } from "../model/nomination.model";

const mongoUrl = process.env.MONGO_URL;

const connection: mongoose.Connection = mongoose.createConnection(mongoUrl, {});
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

export { connection };
