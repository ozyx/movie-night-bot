import { MovieDocument, MovieInput } from "../model/movie.model";
import { MongoClient } from "../structures/MongoClient";
const Movie = MongoClient.getConnection().models.Movie;

export async function createMovie(movie: MovieInput): Promise<MovieDocument> {
    return await Movie.findOneAndUpdate({ imdbID: movie.imdbID }, movie, { upsert: true, new: true });
}
