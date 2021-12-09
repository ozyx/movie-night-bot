import mongoose from "mongoose";
const { Schema } = mongoose;

interface MovieInput {
  title: string;
  year: string,
  rated: string,
  released: string,
  runtime: string,
  genre: string,
  director: string,
  writer: string,
  actors: string,
  plot: string,
  language: string,
  country: string,
  awards: string,
  poster: string,
  ratings: any[],
  metascore: string,
  imdbRating: string,
  imdbVotes: string,
  dvd: string,
  boxOffice: string,
  production: string,
  website: string,
  imdbID: string;
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
