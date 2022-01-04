import mongoose from "mongoose";
import { ISeason } from "../typings/Season";

interface SeasonInput {
  season_num: ISeason["season_num"];
  end_date?: ISeason["end_date"];
  start_date: ISeason["start_date"];
}

type SeasonDocument = SeasonInput & mongoose.Document;

const SeasonType: Record<keyof ISeason, unknown> = {
  season_num: {
    type: Number,
    required: true,
  },
  end_date: {
    type: Date,
    required: false,
  },
  start_date: {
    type: Date,
    required: false,
  }
}


const seasonSchema = new mongoose.Schema(SeasonType);

export { seasonSchema, SeasonDocument, SeasonInput }