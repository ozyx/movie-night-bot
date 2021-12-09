import mongoose from "mongoose";
const { Schema } = mongoose;

interface NominationInput {
  category: string;
  user: string;
  movie: string;
  date_watched?: Date;
}

type NominationDocument = NominationInput & mongoose.Document;

const nominationSchema = new Schema(
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
    category: { type: String, required: true },
    date_watched: { type: Date, default: undefined },
  },
  {
    timestamps: true,
  }
);

export { nominationSchema, NominationInput, NominationDocument };
