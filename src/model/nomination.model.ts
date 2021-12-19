import mongoose from "mongoose";
import { INomination } from "../typings/Nomination";
const { Schema } = mongoose;

interface NominationInput {
  category: INomination["category"];
  user: INomination["user"];
  movie: INomination["movie"];
  season_num: INomination["season_num"];
  date_watched?: INomination["date_watched"];
  watched: INomination["watched"];
}

type NominationDocument = NominationInput & mongoose.Document;

const NominationType: Record<keyof INomination, any> =
{
  movie: {
    type: Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  season_num: { type: Number, required: true },
  category: { type: String, required: true },
  date_watched: { type: Date, default: undefined },
  watched: { type: Boolean, default: false }
};

const nominationSchema = new Schema(NominationType, { timestamps: true });

export { nominationSchema, NominationInput, NominationDocument };
