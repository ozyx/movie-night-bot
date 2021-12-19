import mongoose from "mongoose";
import { IMovie } from "../typings/Movie";
const { Schema } = mongoose;

interface MovieInput {
  title: IMovie["title"],
  year: IMovie["year"],
  rated: IMovie["rated"],
  released: IMovie["released"],
  runtime: IMovie["runtime"],
  genre: IMovie["genre"],
  director: IMovie["director"],
  writer: IMovie["writer"],
  actors: IMovie["actors"],
  plot: IMovie["plot"],
  language: IMovie["language"],
  country: IMovie["country"],
  awards: IMovie["awards"],
  poster: IMovie["poster"],
  ratings: IMovie["ratings"],
  metascore: IMovie["metascore"],
  imdbRating: IMovie["imdbRating"],
  imdbVotes: IMovie["imdbVotes"],
  dvd: IMovie["dvd"],
  boxOffice: IMovie["boxOffice"],
  production: IMovie["production"],
  website: IMovie["website"],
  imdbID: IMovie["imdbID"];
}

const RatingSchema = new Schema(
  {
    Source: String,
    Value: String,
  },
  { _id: false }
);

type MovieDocument = MovieInput & mongoose.Document;

const MovieType = {
  title: String,
  year: String,
  rated: String,
  released: String,
  runtime: String,
  genre: String,
  director: String,
  writer: String,
  actors: String,
  plot: String,
  language: String,
  country: String,
  awards: String,
  poster: String,
  ratings: [RatingSchema],
  metascore: String,
  imdbRating: String,
  imdbVotes: String,
  imdbID: {
    type: String,
    required: true,
    unique: true
  },
  dvd: String,
  boxOffice: String,
  production: String,
  website: String,
};

const movieSchema = new mongoose.Schema<MovieDocument>(MovieType, { timestamps: true });

export { movieSchema, MovieDocument, MovieInput };
